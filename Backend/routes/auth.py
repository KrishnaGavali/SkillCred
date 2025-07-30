from typing import Union
from fastapi import APIRouter
from database import db_dependency
from schemas.routesSchemas.auth import UserSignUp, UserLogin
from utils.Auth.hash_pass_handler import hash_password, verify_password
from utils.Auth.jwt_handler import create_jwt
from models.user import User
import uuid


authRouter = APIRouter(
    tags=["Authentication"], responses={404: {"description": "Not found"}}
)


@authRouter.post("/signup", description="API endpoint for user signup")
async def signup(
    body: UserSignUp.Body, db: db_dependency
) -> Union[UserSignUp.Response.Success, UserSignUp.Response.Error]:
    try:

        # check for existing user
        existing_user = db.query(User).filter(User.email == body.email).first()
        if existing_user:
            return UserSignUp.Response.Error(
                error="User already exists",
                details="A user with this email already exists.",
                status=400,
            )
        # Generate unique user ID
        random_id = f"{body.name.lower().replace(' ', '_')}_{uuid.uuid4().hex[:8]}"

        # Hash the password
        hashed_password = hash_password(body.password)

        # Create the new user instance
        new_user = User(
            id=random_id,
            name=body.name,
            email=body.email,
            password=hashed_password,  # Store hashed password
            profile_picture=body.profile_picture,
            github_username=body.github_username,
        )

        jwt_payload: dict[str, str] = {
            "user_id": new_user.id,
            "email": new_user.email,
        }

        jwt_token: str = create_jwt(jwt_payload, expires_in=60)

        # Add and commit
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return UserSignUp.Response.Success(
            message="User signed up successfully",
            user_id=new_user.id,
            jwt_token=jwt_token,
        )
    except Exception as e:
        db.rollback()
        return UserSignUp.Response.Error(
            error="Database Error",
            details=str(e),
            status=500,
        )


@authRouter.post("/login", description="API endpoint for user login")
async def login(
    body: UserLogin.Body, db: db_dependency
) -> Union[UserLogin.Response.Success, UserLogin.Response.Error]:
    try:
        # Fetch user by email
        user = db.query(User).filter(User.email == body.email).first()

        if not user:
            return UserLogin.Response.Error(
                error="User not found",
                details="No user found with the provided email.",
                status=404,
            )

        # Verify the password
        if not verify_password(body.password, user.password):
            return UserLogin.Response.Error(
                error="Invalid credentials",
                details="The provided password is incorrect.",
                status=401,
            )

        return UserLogin.Response.Success(
            message="User logged in successfully",
            user_id=user.id,
        )
    except Exception as e:
        db.rollback()
        return UserLogin.Response.Error(
            error="Database Error",
            details=str(e),
            status=500,
        )
