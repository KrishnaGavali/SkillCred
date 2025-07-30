from contextlib import asynccontextmanager
from database import test_connection
from fastapi import FastAPI
from dotenv import load_dotenv
from models import user
from routes.auth import authRouter
from database import engine
import os

# Load environment variables from .env file
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not test_connection():
        raise Exception("Database connection failed during startup.")
    print("Database connection established successfully.")
    yield  # Application lifespan continues here
    print("Application shutdown.")


# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# Include routers AFTER creating the app
app.include_router(authRouter, prefix="/auth", tags=["Authentication"])

# Create tables if they don't exist
user.Base.metadata.create_all(bind=engine)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": os.getenv("APP_MESSAGE", "Default Message"),
        "status": os.getenv("SERVER_STATUS", "Default Status"),
    }
