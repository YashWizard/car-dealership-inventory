"""Persistent application entities."""
from sqlalchemy import CheckConstraint, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint(
            "role IN ('user', 'admin')",
            name="valid_user_role",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(254),
        unique=True,
        index=True,
    )
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(10), default="user")
