import { useState } from "react";

const EMPTY = {
  make: "",
  model: "",
  category: "",
  min_price: "",
  max_price: "",
};

export default function FilterBar({ onApply, busy }) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    setError("");

    if (
      values.min_price !== "" &&
      values.max_price !== "" &&
      Number(values.min_price) > Number(values.max_price)
    ) {
      setError("Minimum price cannot exceed maximum price.");
      return;
    }

    onApply({ ...values });
  }

  return (
    <form className="panel p-5" onSubmit={submit}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Find the right vehicle</h2>
        <span className="eyebrow hidden sm:block">SEARCH & FILTER</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["make", "Make", "e.g. Toyota"],
          ["model", "Model", "e.g. Corolla"],
          ["category", "Category", "e.g. SUV"],
          ["min_price", "Minimum price (INR)", "No minimum"],
          ["max_price", "Maximum price (INR)", "No maximum"],
        ].map(([name, label, placeholder]) => {
          const isPrice = name.includes("price");
          return (
            <div key={name}>
              <label htmlFor={`filter-${name}`}>{label}</label>
              <input
                id={`filter-${name}`}
                type={isPrice ? "number" : "text"}
                min={isPrice ? "0" : undefined}
                step={isPrice ? "0.01" : undefined}
                max={isPrice ? "9999999999.99" : undefined}
                maxLength={name === "category" ? 50 : 100}
                value={values[name]}
                placeholder={placeholder}
                onChange={(event) => setValues({
                  ...values,
                  [name]: event.target.value,
                })}
              />
            </div>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4 flex gap-2">
        <button className="btn-primary" disabled={busy}>Apply filters</button>
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() => {
            setValues(EMPTY);
            setError("");
            onApply({});
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
