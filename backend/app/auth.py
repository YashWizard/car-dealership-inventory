"""Registration and login routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()

    existing = db.scalar(select(User).where(User.email == email))
    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        role="user",
    )

    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    email = str(payload.email).strip().lower()
    user = db.scalar(select(User).where(User.email == email))

    encoded = user.password_hash if user else DUMMY_PASSWORD_HASH
    password_valid = verify_password(payload.password, encoded)

    if user is None or not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse.model_validate(user),
    )
