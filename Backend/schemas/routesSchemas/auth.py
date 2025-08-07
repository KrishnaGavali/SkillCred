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

        class Error(BaseModel):
            message: str
            status: int
