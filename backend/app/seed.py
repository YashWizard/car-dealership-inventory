"""Explicit local admin creation and optional sample inventory."""
import argparse
import getpass
import os

from pydantic import EmailStr, TypeAdapter
from sqlalchemy import func, select

from app.database import Base, SessionLocal, engine
from app.models import User, Vehicle
from app.security import hash_password

SAMPLES = [
    {
        "make": "Toyota",
        "model": "Corolla",
        "category": "Sedan",
        "price_paise": 150000000,
        "quantity": 4,
    },
    {
        "make": "Hyundai",
        "model": "Creta",
        "category": "SUV",
        "price_paise": 180000000,
        "quantity": 3,
    },
    {
        "make": "Tata",
        "model": "Nexon",
        "category": "SUV",
        "price_paise": 120000000,
        "quantity": 5,
    },
    {
        "make": "Honda",
        "model": "City",
        "category": "Sedan",
        "price_paise": 160000000,
        "quantity": 2,
    },
    {
        "make": "Maruti Suzuki",
        "model": "Swift",
        "category": "Hatchback",
        "price_paise": 80000000,
        "quantity": 6,
    },
    {
        "make": "Kia",
        "model": "EV6",
        "category": "Electric",
        "price_paise": 600000000,
        "quantity": 0,
    },
]


def seed_database(db, email, password, with_samples=False):
    email = str(
        TypeAdapter(EmailStr).validate_python(email.strip())
    ).lower()

    if not 8 <= len(password) <= 128:
        raise ValueError("Password must contain 8 to 128 characters")

    existing = db.scalar(select(User).where(User.email == email))

    if existing is not None and existing.role != "admin":
        raise ValueError(
            "Email belongs to an ordinary user. Choose another admin email."
        )

    admin_created = existing is None
    if admin_created:
        db.add(User(
            email=email,
            password_hash=hash_password(password),
            role="admin",
        ))

    vehicles_created = 0

    if with_samples:
        count = db.scalar(select(func.count()).select_from(Vehicle))
        if count == 0:
            db.add_all([Vehicle(**values) for values in SAMPLES])
            vehicles_created = len(SAMPLES)

    db.commit()

    return {
        "admin_created": admin_created,
        "vehicles_created": vehicles_created,
    }


def main():
    parser = argparse.ArgumentParser(
        description="Create a local admin and optional sample inventory."
    )
    parser.add_argument("--email", required=True)
    parser.add_argument("--sample", action="store_true")
    args = parser.parse_args()

    password = os.getenv("ADMIN_PASSWORD")
    if not password:
        password = getpass.getpass("New admin password: ")

    Base.metadata.create_all(engine)

    try:
        with SessionLocal() as db:
            result = seed_database(
                db,
                args.email,
                password,
                with_samples=args.sample,
            )
    except ValueError as exc:
        parser.exit(status=1, message=f"Seed failed: {exc}\n")

    if result["admin_created"]:
        print("Admin created.")
    else:
        print("Admin already exists; password unchanged.")

    print(f"Sample vehicles added: {result['vehicles_created']}")
    print("Sample prices are illustrative demo data, not live quotations.")


if __name__ == "__main__":
    main()
