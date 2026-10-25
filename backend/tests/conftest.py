"""Isolated database, HTTP client, and account fixtures."""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models import User
from app.security import hash_password


@pytest.fixture()
def session_factory(tmp_path):
    test_engine = create_engine(
        f"sqlite:///{(tmp_path / 'test.db').as_posix()}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(test_engine)
    factory = sessionmaker(
        bind=test_engine,
        autoflush=False,
        expire_on_commit=False,
    )
    yield factory
    Base.metadata.drop_all(test_engine)
    test_engine.dispose()


@pytest.fixture()
def client(session_factory):
    def override_db():
        with session_factory() as db:
            yield db

    app.dependency_overrides[get_db] = override_db
    test_client = TestClient(app)
    try:
        yield test_client
    finally:
        test_client.close()
        app.dependency_overrides.clear()


@pytest.fixture()
def user_headers(client):
    credentials = {
        "email": "user@example.com",
        "password": "StrongPass123!",
    }
    assert client.post(
        "/api/auth/register", json=credentials
    ).status_code == 201

    response = client.post("/api/auth/login", json=credentials)
    assert response.status_code == 200
    return {
        "Authorization": f"Bearer {response.json()['access_token']}",
    }


@pytest.fixture()
def admin_headers(client, session_factory):
    with session_factory() as db:
        db.add(User(
            email="admin@example.com",
            password_hash=hash_password("AdminPass123!"),
            role="admin",
        ))
        db.commit()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@example.com",
            "password": "AdminPass123!",
        },
    )
    assert response.status_code == 200
    return {
        "Authorization": f"Bearer {response.json()['access_token']}",
    }


@pytest.fixture()
def vehicle_payload():
    return {
        "make": "Toyota",
        "model": "Corolla",
        "category": "Sedan",
        "price": "1500000.00",
        "quantity": 2,
    }


@pytest.fixture()
def vehicle(client, admin_headers, vehicle_payload):
    response = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json=vehicle_payload,
    )
    assert response.status_code == 201
    return response.json()
