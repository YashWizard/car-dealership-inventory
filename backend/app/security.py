"""Password hashing, JWT authentication, and role enforcement."""
import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

SECRET_KEY = os.getenv("SECRET_KEY", "")
if len(SECRET_KEY) < 32:
    raise RuntimeError(
        "Set SECRET_KEY to at least 32 characters in backend/.env"
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "60"))

password_hasher = PasswordHash.recommended()
bearer = HTTPBearer(auto_error=False)

DUMMY_PASSWORD_HASH = password_hasher.hash("not-an-account-password")


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, encoded: str) -> bool:
    return password_hasher.verify(password, encoded)


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=401,
        detail="Invalid or expired authentication",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"require": ["sub", "iat", "exp"]},
        )
        user_id = int(payload["sub"])
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise unauthorized

    user = db.get(User, user_id)
    if user is None:
        raise unauthorized

    return user


def require_admin(user: User = Depends(current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required",
        )
    return user
