"""Vehicle CRUD and validation acceptance tests."""
from decimal import Decimal

import pytest


def test_create_vehicle(client, user_headers, vehicle_payload):
    response = client.post(
        "/api/vehicles", headers=user_headers, json=vehicle_payload
    )
    assert response.status_code == 201
    body = response.json()
    assert body["id"] > 0
    assert body["make"] == "Toyota"
    assert body["model"] == "Corolla"
    assert body["category"] == "Sedan"
    assert Decimal(str(body["price"])) == Decimal("1500000.00")
    assert body["quantity"] == 2


def test_empty_inventory(client, user_headers):
    response = client.get("/api/vehicles", headers=user_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_zero_stock_remains_visible(client, admin_headers, vehicle_payload):
    created = client.post(
        "/api/vehicles",
        headers=admin_headers,
        json={**vehicle_payload, "quantity": 0},
    )
    assert created.status_code == 201
    response = client.get("/api/vehicles", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()[0]["quantity"] == 0


def test_update_vehicle(client, user_headers, vehicle, vehicle_payload):
    response = client.put(
        f"/api/vehicles/{vehicle['id']}",
        headers=user_headers,
        json={**vehicle_payload, "model": "Camry"},
    )
    assert response.status_code == 200
    assert response.json()["model"] == "Camry"


def test_update_missing_vehicle(client, user_headers, vehicle_payload):
    response = client.put(
        "/api/vehicles/999999",
        headers=user_headers,
        json=vehicle_payload,
    )
    assert response.status_code == 404


def test_admin_can_delete(client, admin_headers, vehicle):
    response = client.delete(
        f"/api/vehicles/{vehicle['id']}",
        headers=admin_headers,
    )
    assert response.status_code == 204
    assert client.get(
        "/api/vehicles", headers=admin_headers
    ).json() == []


def test_user_cannot_delete(client, user_headers, vehicle):
    response = client.delete(
        f"/api/vehicles/{vehicle['id']}",
        headers=user_headers,
    )
    assert response.status_code == 403


def test_delete_missing_vehicle(client, admin_headers):
    response = client.delete(
        "/api/vehicles/999999", headers=admin_headers
    )
    assert response.status_code == 404


@pytest.mark.parametrize(
    "change",
    [
        {"make": "   "},
        {"model": ""},
        {"category": ""},
        {"price": "-1"},
        {"price": "NaN"},
        {"quantity": -1},
        {"quantity": 1.5},
        {"quantity": True},
    ],
)
def test_invalid_vehicle_rejected(
    client, user_headers, vehicle_payload, change
):
    response = client.post(
        "/api/vehicles",
        headers=user_headers,
        json={**vehicle_payload, **change},
    )
    assert response.status_code == 422
