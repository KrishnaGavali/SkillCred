from fastapi import APIRouter


userRouter = APIRouter(
    tags=["User"],
    responses={404: {"description": "Not found"}},
)
