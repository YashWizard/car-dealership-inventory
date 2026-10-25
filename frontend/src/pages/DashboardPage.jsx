import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import CarArt from "../components/CarArt";
import FilterBar from "../components/FilterBar";
import VehicleCard from "../components/VehicleCard";
import VehicleForm from "../components/VehicleForm";

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const isAdmin = user.role === "admin";

  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({});
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState(null);
  const actionLock = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      const cleaned = String(value ?? "").trim();
      if (cleaned) params.set(key, cleaned);
    });

    const query = params.toString();
    const path = query
      ? `/api/vehicles/search?${query}`
      : "/api/vehicles";

    setLoading(true);
    setError("");

    api(path, { token, signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setVehicles(data);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setVehicles([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [token, filters, revision]);

  async function perform(path, options, message) {
    if (actionLock.current) return false;
    actionLock.current = true;
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await api(path, { ...options, token });
      setNotice(message);
      setRevision((value) => value + 1);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  }

  async function saveVehicle(payload) {
    const editing = Boolean(editor?.id);
    const success = await perform(
      editing ? `/api/vehicles/${editor.id}` : "/api/vehicles",
      { method: editing ? "PUT" : "POST", body: payload },
      editing ? "Vehicle updated." : "Vehicle added to inventory.",
    );
    if (success) setEditor(null);
  }

  const totalUnits = vehicles.reduce((sum, item) => sum + item.quantity, 0);
  const available = vehicles.filter((item) => item.quantity > 0).length;

  return (
    <div className="min-h-screen">
      <header className="site-header">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <a href="#inventory" className="brand">
            <span className="brand-mark">D</span>
            DriveLedger<span className="brand-dot">.</span>
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <span className="role-badge">
              {isAdmin ? "Admin" : "Customer"}
            </span>
            <span className="max-w-44 truncate text-sm text-slate-500">
              {user.email}
            </span>
            <button className="btn-secondary" disabled={busy} onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main id="inventory" className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <section className="dashboard-hero">
          <div className="relative z-10">
            <p className="eyebrow text-teal-200">
              {isAdmin ? "YOUR DEALERSHIP WORKSPACE" : "EXPLORE THE COLLECTION"}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {isAdmin ? "Inventory, in the clear." : "A better drive starts here."}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-slate-300">
              {isAdmin
                ? "Keep vehicle details accurate, manage availability, and restock with confidence."
                : "Explore listed vehicles, narrow your choices, and purchase available stock."}
            </p>
          </div>
          <CarArt className="hero-car" />
        </section>

        <section
          className="grid gap-4 sm:grid-cols-3"
          aria-label="Current results summary"
        >
          {[
            ["Matching vehicles", vehicles.length],
            ["Models in stock", available],
            ["Units in results", totalUnits],
          ].map(([label, value]) => (
            <div className="panel flex items-center justify-between p-5" key={label}>
              <span className="text-sm text-slate-500">{label}</span>
              <strong className="text-3xl font-bold">
                {loading ? "—" : value}
              </strong>
            </div>
          ))}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">LIVE INVENTORY</p>
            <h2 className="mt-1 text-2xl font-bold">The vehicle collection</h2>
          </div>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              disabled={busy || loading}
              onClick={() => setRevision((value) => value + 1)}
            >
              Refresh
            </button>
            {isAdmin && (
              <button
                className="btn-primary"
                disabled={busy}
                onClick={() => {
                  setEditor({});
                  setError("");
                }}
              >
                + Add vehicle
              </button>
            )}
          </div>
        </div>

        {error && <div role="alert" className="error-box">{error}</div>}
        {notice && <div role="status" className="notice">{notice}</div>}

        {isAdmin && editor !== null && (
          <VehicleForm
            key={editor.id ?? "new"}
            vehicle={editor.id ? editor : null}
            busy={busy}
            onSave={saveVehicle}
            onCancel={() => setEditor(null)}
          />
        )}

        <FilterBar
          busy={busy || loading}
          onApply={(next) => {
            setNotice("");
            setFilters(next);
          }}
        />

        {loading ? (
          <div className="panel p-12 text-center text-slate-500" role="status">
            <span className="loader" />
            Loading the inventory…
          </div>
        ) : vehicles.length === 0 ? (
          <div className="panel p-12 text-center">
            <h3 className="text-xl font-bold">
              {error ? "Inventory could not be loaded" : "No matching vehicles"}
            </h3>
            <p className="mt-3 text-slate-500">
              {error
                ? "Review the error above and use Refresh to try again."
                : "Reset the filters or add inventory using an admin account."}
            </p>
          </div>
        ) : (
          <section
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Vehicle inventory"
          >
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isAdmin={isAdmin}
                busy={busy || loading}
                onEdit={(item) => {
                  setEditor(item);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPurchase={(item) => perform(
                  `/api/vehicles/${item.id}/purchase`,
                  { method: "POST" },
                  `Purchased one ${item.make} ${item.model}. No payment was processed.`,
                )}
                onDelete={async (item) => {
                  if (!window.confirm(`Delete ${item.make} ${item.model}?`)) return;
                  const success = await perform(
                    `/api/vehicles/${item.id}`,
                    { method: "DELETE" },
                    "Vehicle deleted.",
                  );
                  if (success && editor?.id === item.id) setEditor(null);
                }}
                onRestock={(item, quantity) => {
                  if (!Number.isInteger(quantity) || quantity <= 0) {
                    setError("Restock quantity must be a positive integer.");
                    return;
                  }
                  return perform(
                    `/api/vehicles/${item.id}/restock`,
                    { method: "POST", body: { quantity } },
                    `Added ${quantity} units to ${item.make} ${item.model}.`,
                  );
                }}
              />
            ))}
          </section>
        )}

        <footer className="border-t border-slate-200 py-6 text-center text-xs leading-6 text-slate-500">
          DriveLedger · Prices in INR · Illustrative artwork only.
          <br />
          Purchase changes inventory; this demonstration does not process payments.
        </footer>
      </main>
    </div>
  );
}
