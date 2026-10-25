"""Search and filtering acceptance tests."""
import pytest


@pytest.mark.parametrize(
    "params",
    [
        {"make": "toyo"},
        {"model": "roll"},
        {"category": "sedan"},
        {"min_price": "1500000"},
        {"max_price": "1500000"},
        {
            "make": "Toyota",
            "category": "Sedan",
            "min_price": "1000000",
            "max_price": "2000000",
        },
    ],
)
def test_matching_filters(client, user_headers, vehicle, params):
    response = client.get(
        "/api/vehicles/search",
        headers=user_headers,
        params=params,
    )
    assert response.status_code == 200
    assert [item["id"] for item in response.json()] == [vehicle["id"]]


def test_no_matches(client, user_headers, vehicle):
    response = client.get(
        "/api/vehicles/search",
        headers=user_headers,
        params={"make": "Nonexistent"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_combined_filters_use_and(client, user_headers, vehicle):
    response = client.get(
        "/api/vehicles/search",
        headers=user_headers,
        params={"make": "Toyota", "model": "Nonexistent"},
    )
    assert response.status_code == 200
    assert response.json() == []


def test_invalid_price_range(client, user_headers):
    response = client.get(
        "/api/vehicles/search",
        headers=user_headers,
        params={"min_price": "200", "max_price": "100"},
    )
    assert response.status_code == 422
