from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import JSONResponse
from database import db_dependency
from schemas.routesSchemas.auth import UserSignUp, UserLogin, UserVerify
from utils.Auth.hash_pass_handler import hash_password, verify_password
from utils.Auth.jwt_handler import create_jwt, verify_jwt
from models.user import User
from email_validator import validate_email, EmailNotValidError
from github import Github, Auth
from typing import Annotated
import requests
import os

authRouter = APIRouter(
    tags=["Authentication"], responses={404: {"description": "Not found"}}
)


@authRouter.post(
    "/signup",
    description="API endpoint for user signup",
    response_model=UserSignUp.Response.Success,
)
async def signup(body: UserSignUp.Body, db: db_dependency) -> JSONResponse:
    try:
        # Validate email format
        try:
            validated_email: str = validate_email(
                body.email, check_deliverability=False
            ).email
        except EmailNotValidError as e:
            raise HTTPException(
                status_code=400,
                detail=UserSignUp.Response.Error(
                    message=f"Invalid email address: {str(e)}",
                    status=400,
                ).model_dump(),
            )

        # Check if user exists
        existing_user: User | None = (
            db.query(User).filter(User.email == validated_email).first()
        )
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=UserSignUp.Response.Error(
                    message="A user with this email already exists.",
                    status=400,
                ).model_dump(),
            )

        # Hash password and create user
        hashed_password: str = hash_password(body.password)
        new_user = User(email=validated_email, password=hashed_password)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # JWT payload and token
        jwt_payload: dict[str, str] = {
            "user_id": str(new_user.id),
            "email": validated_email,
        }
        jwt_token: str = create_jwt(jwt_payload, expires_in=60)

        # Response with secure cookie
        response = JSONResponse(
            content=UserSignUp.Response.Success(
                message="User created successfully",
                user_id=str(new_user.id),
                email=validated_email,
                auth_token=jwt_token,
            ).model_dump(),
            status_code=201,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error during signup: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=UserSignUp.Response.Error(
                message="Internal server error",
                status=500,
            ).model_dump(),
        )


@authRouter.post(
    "/login",
    description="API endpoint for user login",
    response_model=UserLogin.Response.Success,
)
async def login(body: UserLogin.Body, db: db_dependency) -> JSONResponse:
    try:
        # Validate email format
        try:
            validated_email: str = validate_email(
                body.email, check_deliverability=False
            ).email
        except EmailNotValidError as e:
            raise HTTPException(
                status_code=400,
                detail=UserLogin.Response.Error(
                    message=f"Invalid email address: {str(e)}",
                    status=400,
                ).model_dump(),
            )

        # Fetch user
        user: User | None = db.query(User).filter(User.email == validated_email).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail=UserLogin.Response.Error(
                    message="User not found",
                    status=404,
                ).model_dump(),
            )

        if not user.password:
            raise HTTPException(
                status_code=400,
                detail=UserLogin.Response.Error(
                    message="Login through this authentication method is not allowed",
                    status=400,
                ).model_dump(),
            )

        # Verify password
        if not verify_password(body.password, user.password):
            raise HTTPException(
                status_code=401,
                detail=UserLogin.Response.Error(
                    message="Invalid credentials",
                    status=401,
                ).model_dump(),
            )

        # Create JWT
        jwt_payload: dict[str, str] = {
            "user_id": str(user.id),
            "email": user.email,
        }
        jwt_token: str = create_jwt(jwt_payload, expires_in=60)

        # Response with secure cookie
        response = JSONResponse(
            content=UserLogin.Response.Success(
                message="User logged in successfully",
                user_id=str(user.id),
                email=str(validated_email),
                auth_token=jwt_token,
            ).model_dump(),
            status_code=200,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=UserLogin.Response.Error(
                message="Internal server error",
                status=500,
            ).model_dump(),
        )


@authRouter.post("/verify")
async def verify_user(
    Authorization: Annotated[str, Header()],
) -> JSONResponse:

    try:
        jwt_token = Authorization
        response = verify_jwt(jwt_token)

        if response.get("success") is False:
            raise HTTPException(
                status_code=401, detail={"message": "Invalid or expired token"}
            )

        return JSONResponse(
            content={
                "success": True,
                "message": "User is authenticated",
                "user_data": response.get("userData", {}),
            },
            status_code=200,
        )

    except HTTPException:
        raise


@authRouter.post(
    "/github/set-token",
    description="API endpoint to exchange GitHub code for access token and fetch user data",
)
async def set_github_token(token: str, db: db_dependency) -> JSONResponse:
    try:
        if not token or len(token) < 20:
            raise HTTPException(
                status_code=400,
                detail=UserSignUp.Response.Error(
                    message="Invalid GitHub OAuth token",
                    status=400,
                ).model_dump(),
            )

        # Step 1: Exchange GitHub OAuth code for access token
        response = requests.post(
            url="https://github.com/login/oauth/access_token",
            data={
                "client_id": os.getenv("AUTH_GITHUB_ID"),
                "client_secret": os.getenv("AUTH_GITHUB_SECRET"),
                "code": token,
            },
            headers={"Accept": "application/json"},
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=UserSignUp.Response.Error(
                    message="Failed to exchange GitHub code for access token",
                    status=response.status_code,
                ).model_dump(),
            )

        access_token = response.json().get("access_token")

        print(f"Access Token: {access_token}")  # Debugging line

        if not access_token:
            raise HTTPException(
                status_code=400,
                detail=UserSignUp.Response.Error(
                    message="Invalid or Expired GitHub OAuth token",
                    status=400,
                ).model_dump(),
            )

        # Step 2: Use PyGithub to fetch user data

        auth = Auth.Token(access_token)

        github = Github(auth=auth)
        gh_user = github.get_user()

        print(f"GitHub User: {gh_user.login}")  # Debugging line

        # Extract user data
        email = gh_user.email or ""  # Email might be None

        username = gh_user.login
        name = gh_user.name
        profile_url = gh_user.html_url

        # Optional: you could pull repos or public stats here too

        existing_user: User | None = db.query(User).filter(User.email == email).first()

        if existing_user:
            return JSONResponse(content={})

        # Step 3: Save to DB
        new_user = User(
            email=email,
            github_access_token=access_token,
            is_profile_complete=False,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        id = str(new_user.id)

        return JSONResponse(
            content={
                "message": "GitHub access token and user info received",
                "user_data": {
                    "email": email,
                    "username": username,
                    "name": name,
                    "profile_url": profile_url,
                    "repos_url": "",
                    "userId": id,
                },
            },
            status_code=200,
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=UserSignUp.Response.Error(
                message=f"Internal server error: {str(e)}",
                status=500,
            ).model_dump(),
        )
