from uuid import UUID, uuid4

from sqlalchemy import String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from database import Base  # ✅ Assuming your own declarative Base from database.py


# -------------------- ENUMS --------------------


# class UserRole(str, Enum):
#     STUDENT = "student"
#     STUDENT_INTERN = "student_intern"
#     FRESHER = "fresher"


# -------------------- USER MODEL --------------------
class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False,
    )
    github_access_token: Mapped[str] = mapped_column(String, nullable=True)
    password: Mapped[str] = mapped_column(
        String,
        nullable=True,
    )  # Optional for OAuth users, required for local auth
    is_profile_complete: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
    )  # Indicates if the user has completed their profile


# -------------------- USER PROFILE MODEL --------------------
class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        unique=True,
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    profile_picture_url: Mapped[str] = mapped_column(String, nullable=True)
    github_url: Mapped[str] = mapped_column(String, nullable=True)
    linkedin_url: Mapped[str] = mapped_column(String, nullable=True)
    student: Mapped[bool] = mapped_column(default=False)
    fresher: Mapped[bool] = mapped_column(default=False)
    college: Mapped[str] = mapped_column(String, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=True)
    country: Mapped[str] = mapped_column(String, nullable=True)
