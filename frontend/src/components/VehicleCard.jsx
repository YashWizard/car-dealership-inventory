import { useState } from "react";
import CarArt from "./CarArt";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function VehicleCard({
  vehicle,
  isAdmin = false,
  busy = false,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) {
  const [units, setUnits] = useState("1");
  const outOfStock = vehicle.quantity === 0;

  return (
    <article className="vehicle-card">
      <div className="vehicle-art">
        <span className="category-tag">{vehicle.category}</span>
        <span className="art-caption">ILLUSTRATIVE ARTWORK</span>
        <CarArt className="car-drawing" />
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">INVENTORY #{vehicle.id}</p>
          <span className={outOfStock ? "stock-badge stock-empty" : "stock-badge"}>
            {outOfStock ? "Unavailable" : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight">
          {vehicle.make} {vehicle.model}
        </h3>
        <p className="mt-3 text-2xl font-bold tracking-tight">
          {currency.format(Number(vehicle.price))}
        </p>
        <p className="mt-1 text-xs text-slate-500">Listed price · INR</p>

        <button
          type="button"
          className="btn-primary mt-5 w-full"
          disabled={busy || outOfStock}
          onClick={() => onPurchase?.(vehicle)}
        >
          {outOfStock ? "Out of stock" : "Purchase"}
          <span aria-hidden="true">↗</span>
        </button>

        {isAdmin && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="btn-secondary"
                disabled={busy}
                onClick={() => onEdit?.(vehicle)}
              >
                Edit
              </button>
              <button
                className="btn-danger"
                disabled={busy}
                onClick={() => onDelete?.(vehicle)}
              >
                Delete
              </button>
            </div>

            <form
              className="mt-3 flex items-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                onRestock?.(vehicle, Number(units));
              }}
            >
              <div className="min-w-0 flex-1">
                <label htmlFor={`restock-${vehicle.id}`}>Units to add</label>
                <input
                  id={`restock-${vehicle.id}`}
                  type="number"
                  min="1"
                  max="1000000000"
                  step="1"
                  required
                  value={units}
                  disabled={busy}
                  onChange={(event) => setUnits(event.target.value)}
                />
              </div>
              <button className="btn-secondary" disabled={busy}>Restock</button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
