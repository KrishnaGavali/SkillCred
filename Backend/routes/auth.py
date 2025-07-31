from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from database import db_dependency
from schemas.routesSchemas.auth import UserSignUp, UserLogin
from utils.Auth.hash_pass_handler import hash_password, verify_password
from utils.Auth.jwt_handler import create_jwt
from models.user import User
from email_validator import validate_email, EmailNotValidError
import uuid

authRouter = APIRouter(
    tags=["Authentication"], responses={404: {"description": "Not found"}}
)


@authRouter.post("/signup", description="API endpoint for user signup")
async def signup(body: UserSignUp.Body, db: db_dependency) -> JSONResponse:
    try:
        # Email format validation
        try:
            validated_email = validate_email(
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

        # Check for existing user
        existing_user = db.query(User).filter(User.email == validated_email).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=UserSignUp.Response.Error(
                    message="A user with this email already exists.",
                    status=400,
                ).model_dump(),
            )

        # Generate unique user ID
        random_id = f"{body.name.lower().replace(' ', '_')}_{uuid.uuid4().hex[:8]}"

        # Hash the password securely
        hashed_password = hash_password(body.password)

        # Create the new user instance
        new_user = User(
            id=random_id,
            name=body.name,
            email=validated_email,
            password=hashed_password,
            profile_picture=body.profile_picture,
            github_username=body.github_username,
        )

        # Create JWT payload
        jwt_payload = {
            "user_id": new_user.id,
            "email": validated_email,
        }
        jwt_token = create_jwt(jwt_payload, expires_in=60)

        # Save to database
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # Prepare secure response
        response = JSONResponse(
            content=UserSignUp.Response.Success(
                message="User created successfully",
                user_id=new_user.id,
            ).model_dump(),
            status_code=201,
        )

        # Secure cookie (HTTPOnly, SameSite)
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
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=UserSignUp.Response.Error(
                message="Internal server error",
                status=500,
            ).model_dump(),
        )


@authRouter.post("/login", description="API endpoint for user login")
async def login(body: UserLogin.Body, db: db_dependency) -> JSONResponse:
    try:
        # Email format validation
        try:
            validated_email = validate_email(
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
        user = db.query(User).filter(User.email == validated_email).first()
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
        jwt_payload = {
            "user_id": user.id,
            "email": user.email,
        }
        jwt_token = create_jwt(jwt_payload, expires_in=60)

        # Secure response
        response = JSONResponse(
            content=UserLogin.Response.Success(
                message="User logged in successfully",
                user_id=user.id,
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
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=UserLogin.Response.Error(
                message="Internal server error",
                status=500,
            ).model_dump(),
        )
