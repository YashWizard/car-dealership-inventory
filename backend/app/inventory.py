"""Purchase and restock using conditional stock updates."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import update
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Vehicle
from app.schemas import RestockRequest, VehicleResponse
from app.security import current_user, require_admin

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Inventory"],
    dependencies=[Depends(current_user)],
)

MAX_STOCK = 1000000000


@router.post("/{vehicle_id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
):
    result = db.execute(
        update(Vehicle)
        .where(
            Vehicle.id == vehicle_id,
            Vehicle.quantity > 0,
        )
        .values(quantity=Vehicle.quantity - 1)
        .execution_options(synchronize_session=False)
    )

    if result.rowcount != 1:
        db.rollback()
        if db.get(Vehicle, vehicle_id) is None:
            raise HTTPException(
                status_code=404, detail="Vehicle not found"
            )
        raise HTTPException(
            status_code=409, detail="Vehicle is out of stock"
        )

    db.commit()
    db.expire_all()
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=404, detail="Vehicle no longer exists"
        )
    return vehicle


@router.post("/{vehicle_id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    vehicle_id: int,
    payload: RestockRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    result = db.execute(
        update(Vehicle)
        .where(
            Vehicle.id == vehicle_id,
            Vehicle.quantity <= MAX_STOCK - payload.quantity,
        )
        .values(quantity=Vehicle.quantity + payload.quantity)
        .execution_options(synchronize_session=False)
    )

    if result.rowcount != 1:
        db.rollback()
        if db.get(Vehicle, vehicle_id) is None:
            raise HTTPException(
                status_code=404, detail="Vehicle not found"
            )
        raise HTTPException(
            status_code=409,
            detail="Restock would exceed the stock limit",
        )

    db.commit()
    db.expire_all()
    vehicle = db.get(Vehicle, vehicle_id)

    if vehicle is None:
        raise HTTPException(
            status_code=404, detail="Vehicle no longer exists"
        )
    return vehicle
