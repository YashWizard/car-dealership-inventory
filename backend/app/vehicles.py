"""Authenticated vehicle CRUD and search."""
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Vehicle
from app.schemas import VehicleRequest, VehicleResponse
from app.security import current_user, require_admin

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"],
    dependencies=[Depends(current_user)],
)


def get_vehicle_or_404(db: Session, vehicle_id: int) -> Vehicle:
    vehicle = db.get(Vehicle, vehicle_id)
    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


def vehicle_values(payload: VehicleRequest) -> dict:
    return {
        "make": payload.make,
        "model": payload.model,
        "category": payload.category,
        "price_paise": int(payload.price * 100),
        "quantity": payload.quantity,
    }


@router.post("", response_model=VehicleResponse, status_code=201)
def create_vehicle(
    payload: VehicleRequest,
    db: Session = Depends(get_db),
):
    vehicle = Vehicle(**vehicle_values(payload))
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.get("", response_model=list[VehicleResponse])
def list_vehicles(db: Session = Depends(get_db)):
    return db.scalars(
        select(Vehicle).order_by(Vehicle.id)
    ).all()


@router.get("/search", response_model=list[VehicleResponse])
def search_vehicles(
    make: str | None = Query(default=None, max_length=100),
    model: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=50),
    min_price: Decimal | None = Query(
        default=None, ge=0, max_digits=12,
        decimal_places=2, allow_inf_nan=False,
    ),
    max_price: Decimal | None = Query(
        default=None, ge=0, max_digits=12,
        decimal_places=2, allow_inf_nan=False,
    ),
    db: Session = Depends(get_db),
):
    if (
        min_price is not None
        and max_price is not None
        and min_price > max_price
    ):
        raise HTTPException(
            status_code=422,
            detail="Minimum price cannot exceed maximum price",
        )

    statement = select(Vehicle)

    if make and make.strip():
        statement = statement.where(
            func.lower(Vehicle.make).contains(
                make.strip().lower(), autoescape=True
            )
        )

    if model and model.strip():
        statement = statement.where(
            func.lower(Vehicle.model).contains(
                model.strip().lower(), autoescape=True
            )
        )

    if category and category.strip():
        statement = statement.where(
            func.lower(Vehicle.category) == category.strip().lower()
        )

    if min_price is not None:
        statement = statement.where(
            Vehicle.price_paise >= int(min_price * 100)
        )

    if max_price is not None:
        statement = statement.where(
            Vehicle.price_paise <= int(max_price * 100)
        )

    return db.scalars(statement.order_by(Vehicle.id)).all()


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleRequest,
    db: Session = Depends(get_db),
):
    vehicle = get_vehicle_or_404(db, vehicle_id)

    for field, value in vehicle_values(payload).items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(
    vehicle_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    vehicle = get_vehicle_or_404(db, vehicle_id)
    db.delete(vehicle)
    db.commit()
    return Response(status_code=204)
