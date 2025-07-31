from typing import Optional
from pydantic import BaseModel


class UserSignUp(BaseModel):
    class Body(BaseModel):
        name: str
        email: str
        password: str
        profile_picture: Optional[str] = None
        github_username: Optional[str] = None

    class Response(BaseModel):
        class Success(BaseModel):
            message: str
            user_id: str

        class Error(BaseModel):
            message: str
            status: int


class UserLogin(BaseModel):
    class Body(BaseModel):
        email: str
        password: str

    class Response(BaseModel):
        class Success(BaseModel):
            message: str
            user_id: str

        class Error(BaseModel):
            message: str
            status: int
