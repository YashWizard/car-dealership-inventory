"""Persistent user and vehicle entities."""
from decimal import Decimal

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
        String(254), unique=True, index=True
    )
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(10), default="user")


class Vehicle(Base):
    __tablename__ = "vehicles"
    __table_args__ = (
        CheckConstraint("price_paise >= 0", name="nonnegative_price"),
        CheckConstraint(
            "quantity >= 0 AND quantity <= 1000000000",
            name="valid_stock",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    make: Mapped[str] = mapped_column(String(100), index=True)
    model: Mapped[str] = mapped_column(String(100), index=True)
    category: Mapped[str] = mapped_column(String(50), index=True)
    price_paise: Mapped[int] = mapped_column()
    quantity: Mapped[int] = mapped_column(default=0)

    @property
    def price(self) -> Decimal:
        return (
            Decimal(self.price_paise) / Decimal("100")
        ).quantize(Decimal("0.01"))
