from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import db_dependency
from schemas.routesSchemas.auth import UserSignUp, UserLogin
from utils.Auth.hash_pass_handler import hash_password, verify_password
from utils.Auth.jwt_handler import create_jwt
from models.user import User
from email_validator import validate_email, EmailNotValidError
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
            ).model_dump(),
            status_code=201,
        )

        response.set_cookie(
            key="jwt_token",
            value=jwt_token,
            httponly=True,
            secure=True,
            samesite="lax",
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
            ).model_dump(),
            status_code=200,
        )

        response.set_cookie(
            key="jwt_token",
            value=jwt_token,
            httponly=True,
            secure=True,
            samesite="lax",
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


@authRouter.post(
    "/github/set-token",
    description="API endpoint to exchange GitHub code for access token and fetch user data",
)
async def set_github_token(token: str, db: db_dependency) -> JSONResponse:
    try:
        if not token or len(token) < 20:
            raise HTTPException(
                status_code=400,
                detail="Invalid GitHub code format",
            )

        # Step 1: Exchange code for access token
        req = requests.post(
            url="https://github.com/login/oauth/access_token",
            data={
                "client_id": os.getenv("AUTH_GITHUB_ID"),
                "client_secret": os.getenv("AUTH_GITHUB_SECRET"),
                "code": token,
            },
            headers={"Accept": "application/json"},
        )

        if req.status_code != 200:
            raise HTTPException(
                status_code=req.status_code,
                detail="Failed to exchange GitHub code",
            )

        access_token = req.json().get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=400,
                detail="Access token not found in response",
            )

        # Step 2: Use the access token to get user info
        user_info = requests.get(
            url="https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
            },
        )

        if user_info.status_code != 200:
            raise HTTPException(
                status_code=user_info.status_code,
                detail="Failed to fetch user info from GitHub",
            )

        user_data = user_info.json()

        return JSONResponse(
            content={
                "message": "GitHub access token and user info received",
                "user_data": user_data,
            },
            status_code=200,
        )

    except HTTPException:
        raise
