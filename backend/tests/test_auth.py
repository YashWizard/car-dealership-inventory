"""Registration and login acceptance tests."""
CREDS = {
    "email": "buyer@example.com",
    "password": "StrongPass123!",
}


def register(client, **changes):
    return client.post(
        "/api/auth/register",
        json={**CREDS, **changes},
    )


def test_registration_returns_public_user(client):
    response = register(client)

    assert response.status_code == 201
    body = response.json()
    assert body["id"] > 0
    assert body["email"] == CREDS["email"]
    assert body["role"] == "user"
    assert "password" not in body
    assert "password_hash" not in body


def test_duplicate_email_is_case_insensitive(client):
    assert register(client).status_code == 201
    assert register(
        client, email="BUYER@example.com"
    ).status_code == 409


def test_invalid_email_is_rejected(client):
    assert register(client, email="invalid").status_code == 422


def test_short_password_is_rejected(client):
    assert register(client, password="abc").status_code == 422


def test_registration_cannot_grant_admin_role(client):
    response = register(client, role="admin")
    assert response.status_code == 201
    assert response.json()["role"] == "user"


def test_login_returns_token_and_user(client):
    register(client)
    response = client.post("/api/auth/login", json=CREDS)

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == CREDS["email"]
    assert body["user"]["role"] == "user"


def test_wrong_password_is_rejected(client):
    register(client)
    response = client.post(
        "/api/auth/login",
        json={**CREDS, "password": "WrongPassword123!"},
    )
    assert response.status_code == 401


def test_unknown_account_is_rejected(client):
    response = client.post("/api/auth/login", json=CREDS)
    assert response.status_code == 401
