from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os

from database import test_connection, engine
from models import user
from routes.auth import authRouter

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not test_connection():
        raise Exception("Database connection failed during startup.")
    print("✅ Database connection established successfully.")
    yield
    print("🛑 Application shutdown.")


# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# Properly add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in prod for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter()

api_router.include_router(authRouter, prefix="/auth", tags=["Authentication"])

# Include routers AFTER creating the app
app.include_router(api_router, prefix="/api")

# Create tables from user models
user.Base.metadata.create_all(bind=engine)


# Root route
@app.get("/")
async def root() -> dict[str, str]:
    return {
        "message": os.getenv("APP_MESSAGE", "Default Message"),
        "status": os.getenv("SERVER_STATUS", "Running"),
    }
