"""Authentication enforcement on protected routes."""
import pytest


@pytest.mark.parametrize(
    "method,path",
    [
        ("get", "/api/vehicles"),
        ("get", "/api/vehicles/search"),
        ("post", "/api/vehicles"),
        ("put", "/api/vehicles/1"),
        ("delete", "/api/vehicles/1"),
        ("post", "/api/vehicles/1/purchase"),
        ("post", "/api/vehicles/1/restock"),
    ],
)
def test_missing_authentication(client, method, path):
    response = getattr(client, method)(path)
    assert response.status_code == 401


def test_invalid_token(client):
    response = client.get(
        "/api/vehicles",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response.status_code == 401
