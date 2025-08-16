from pydantic import BaseModel


class UserSignUp(BaseModel):
    class Body(BaseModel):
        email: str
        password: str

    class Response(BaseModel):
        class Success(BaseModel):
            message: str
            user_id: str
            email: str
            auth_token: str

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
            email: str
            auth_token: str

        class Error(BaseModel):
            message: str
            status: int


class UserVerify(BaseModel):
    class Body(BaseModel):
        token: str
        user_id: str

    class Response(BaseModel):
        class Success(BaseModel):
            message: str
            success: bool

        class Error(BaseModel):
            success: bool
            message: str
            status: int
