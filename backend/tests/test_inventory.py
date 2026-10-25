"""Purchase, restock, and stock validation tests."""
import pytest


def test_purchase_decreases_stock(client, user_headers, vehicle):
    response = client.post(
        f"/api/vehicles/{vehicle['id']}/purchase",
        headers=user_headers,
    )
    assert response.status_code == 200
    assert response.json()["quantity"] == 1


def test_purchase_cannot_reduce_stock_below_zero(client, user_headers, vehicle):
    url = f"/api/vehicles/{vehicle['id']}/purchase"
    assert client.post(url, headers=user_headers).status_code == 200
    assert client.post(url, headers=user_headers).status_code == 200
    assert client.post(url, headers=user_headers).status_code == 409

    response = client.get("/api/vehicles", headers=user_headers)
    assert response.json()[0]["quantity"] == 0


def test_purchase_missing_vehicle(client, user_headers):
    response = client.post(
        "/api/vehicles/999999/purchase",
        headers=user_headers,
    )
    assert response.status_code == 404


def test_admin_can_restock(client, admin_headers, vehicle):
    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        headers=admin_headers,
        json={"quantity": 3},
    )
    assert response.status_code == 200
    assert response.json()["quantity"] == 5


def test_user_cannot_restock(client, user_headers, vehicle):
    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        headers=user_headers,
        json={"quantity": 3},
    )
    assert response.status_code == 403


def test_restock_missing_vehicle(client, admin_headers):
    response = client.post(
        "/api/vehicles/999999/restock",
        headers=admin_headers,
        json={"quantity": 3},
    )
    assert response.status_code == 404


@pytest.mark.parametrize("quantity", [0, -1, 1.5, True])
def test_invalid_restock_quantity(client, admin_headers, vehicle, quantity):
    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        headers=admin_headers,
        json={"quantity": quantity},
    )
    assert response.status_code == 422
