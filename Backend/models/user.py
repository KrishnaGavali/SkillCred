from sqlalchemy import String
from sqlalchemy.dialects.postgresql import UUID as SQLUUID
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from uuid import UUID
from sqlalchemy.sql import func
from enum import Enum


class User(Base):
    # This is the line you need to add
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        SQLUUID(as_uuid=True),
        primary_key=True,
        unique=True,
        # It's a good practice to add a default UUID generator
        server_default=func.gen_random_uuid(),
    )

    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)


class UserRole(str, Enum):
    STUDENT = "student"
    STUDENT_INTERN = "student_intern"
    FRESHER = "fresher"


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[UUID] = mapped_column(
        SQLUUID(as_uuid=True),
        primary_key=True,
        unique=True,
    )
    user_id: Mapped[UUID] = mapped_column(
        SQLUUID(as_uuid=True),
        nullable=False,
        index=True,
        foreign_key="users.id",
    )
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    profile_picture_url: Mapped[str] = mapped_column(String, nullable=True)
    github_url: Mapped[str] = mapped_column(String, nullable=True)
    linkedin_url: Mapped[str] = mapped_column(String, nullable=True)
    student: Mapped[bool] = mapped_column(default=False)
    fresher: Mapped[bool] = mapped_column(default=False)
    yoe: Mapped[int] = mapped_column(default=0)
    college: Mapped[str] = mapped_column(String, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
