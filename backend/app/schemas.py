"""Request validation and public response contracts."""
from decimal import Decimal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    role: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class VehicleRequest(BaseModel):
    make: str = Field(min_length=1, max_length=100)
    model: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    price: Decimal = Field(
        ge=0,
        max_digits=12,
        decimal_places=2,
        allow_inf_nan=False,
    )
    quantity: int = Field(strict=True, ge=0, le=1000000000)

    @field_validator("make", "model", "category", mode="before")
    @classmethod
    def clean_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    make: str
    model: str
    category: str
    price: Decimal
    quantity: int


class RestockRequest(BaseModel):
    quantity: int = Field(strict=True, gt=0, le=1000000000)
