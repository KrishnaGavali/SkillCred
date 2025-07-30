from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String, primary_key=True, index=True, autoincrement=False
    )
    name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)
    profile_picture: Mapped[str] = mapped_column(String, nullable=True)
    github_username: Mapped[str] = mapped_column(String, nullable=True)
