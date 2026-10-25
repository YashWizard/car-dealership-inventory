import { useState } from "react";

export default function VehicleForm({ vehicle, onSave, onCancel, busy }) {
  const [values, setValues] = useState({
    make: vehicle?.make ?? "",
    model: vehicle?.model ?? "",
    category: vehicle?.category ?? "",
    price: vehicle?.price ?? "",
    quantity: vehicle?.quantity ?? "0",
  });

  return (
    <section className="panel editor-panel p-6" aria-labelledby="vehicle-editor">
      <div className="mb-5">
        <p className="eyebrow">ADMIN WORKSPACE</p>
        <h2 id="vehicle-editor" className="mt-2 text-2xl font-bold">
          {vehicle ? "Edit vehicle" : "Add a vehicle"}
        </h2>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            make: values.make.trim(),
            model: values.model.trim(),
            category: values.category.trim(),
            price: String(values.price),
            quantity: Number(values.quantity),
          });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["make", "Make", "text", 100],
            ["model", "Model", "text", 100],
            ["category", "Category", "text", 50],
            ["price", "Price (INR)", "number"],
            ["quantity", "Stock quantity", "number"],
          ].map(([name, label, type, length]) => (
            <div key={name}>
              <label htmlFor={`vehicle-${name}`}>{label}</label>
              <input
                id={`vehicle-${name}`}
                type={type}
                required
                disabled={busy}
                maxLength={length}
                min={type === "number" ? "0" : undefined}
                max={
                  name === "quantity" ? "1000000000"
                    : name === "price" ? "9999999999.99"
                      : undefined
                }
                step={
                  name === "price" ? "0.01"
                    : name === "quantity" ? "1"
                      : undefined
                }
                value={values[name]}
                onChange={(event) => setValues({
                  ...values,
                  [name]: event.target.value,
                })}
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button className="btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save vehicle"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
