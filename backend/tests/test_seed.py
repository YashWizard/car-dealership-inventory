"""Admin and sample-data initialization tests."""
import pytest
from sqlalchemy import func, select

from app.models import User, Vehicle
from app.security import hash_password, verify_password
from app.seed import seed_database


def test_seed_creates_admin_with_hashed_password(session_factory):
    with session_factory() as db:
        seed_database(db, "ADMIN@example.com", "AdminPass123!")

        admin = db.scalar(
            select(User).where(User.email == "admin@example.com")
        )
        assert admin is not None
        assert admin.role == "admin"
        assert admin.password_hash != "AdminPass123!"
        assert verify_password("AdminPass123!", admin.password_hash)


def test_seed_is_repeatable_without_resetting_password(session_factory):
    with session_factory() as db:
        seed_database(db, "admin@example.com", "OriginalPass123!")
        seed_database(db, "admin@example.com", "DifferentPass123!")

        assert db.scalar(select(func.count()).select_from(User)) == 1
        admin = db.scalar(select(User))
        assert verify_password("OriginalPass123!", admin.password_hash)


def test_seed_adds_samples_only_to_empty_inventory(session_factory):
    with session_factory() as db:
        seed_database(
            db, "admin@example.com", "AdminPass123!",
            with_samples=True,
        )
        assert db.scalar(select(func.count()).select_from(Vehicle)) == 6

        seed_database(
            db, "admin@example.com", "AdminPass123!",
            with_samples=True,
        )
        assert db.scalar(select(func.count()).select_from(Vehicle)) == 6


def test_seed_rejects_short_password(session_factory):
    with session_factory() as db:
        with pytest.raises(ValueError):
            seed_database(db, "admin@example.com", "short")

        assert db.scalar(select(func.count()).select_from(User)) == 0


def test_seed_does_not_silently_promote_existing_user(session_factory):
    with session_factory() as db:
        db.add(User(
            email="buyer@example.com",
            password_hash=hash_password("BuyerPass123!"),
            role="user",
        ))
        db.commit()

        with pytest.raises(ValueError):
            seed_database(db, "buyer@example.com", "AdminPass123!")

        assert db.scalar(select(User)).role == "user"
