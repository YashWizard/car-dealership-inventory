import { useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import VehicleImage from "../components/VehicleImage";

export default function AuthPage() {
  const { signIn, sessionMessage } = useAuth();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  async function submit(event) {
    event.preventDefault();
    if (lock.current) return;

    lock.current = true;
    setBusy(true);
    setError("");

    try {
      await signIn({ email: email.trim(), password }, register);
    } catch (err) {
      setError(err.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-story">
        <a href="#account" className="brand text-white">
          <span className="brand-mark">D</span>
          DriveLedger<span className="brand-dot">.</span>
        </a>

        <div className="my-10">
          <p className="eyebrow text-teal-200">
            A CLEARER VIEW OF YOUR NEXT DRIVE
          </p>
          <h1 className="mt-5 max-w-xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Good cars.<br />
            Clear choices.<br />
            <span className="text-teal-200">One inventory.</span>
          </h1>
          <p className="mt-6 max-w-md leading-7 text-slate-300">
            Explore availability, compare listed prices, and manage stock
            from one connected workspace.
          </p>

          <div className="auth-car mt-8">
            <VehicleImage hero />
          </div>
        </div>

        <p className="text-xs leading-6 text-slate-400">
          Inventory demonstration · No payment processing · Representative automotive photography
        </p>
      </section>

      <section id="account" className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="eyebrow">
            {register ? "START YOUR ACCOUNT" : "WELCOME BACK"}
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {register ? "Make your next move." : "Your inventory awaits."}
          </h2>
          <p className="mt-3 leading-7 text-slate-500">
            {register
              ? "Create an account to explore and purchase available stock."
              : "Sign in to browse vehicles or manage the dealership."}
          </p>

          {sessionMessage && (
            <p role="status" className="notice mt-6">{sessionMessage}</p>
          )}

          <form onSubmit={submit} className="mt-8 space-y-5">
            {error && <p role="alert" className="error-box">{error}</p>}

            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                disabled={busy}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete={register ? "new-password" : "current-password"}
                minLength={register ? 8 : 1}
                maxLength={128}
                required
                value={password}
                disabled={busy}
                onChange={(event) => setPassword(event.target.value)}
              />
              {register && (
                <p className="mt-2 text-xs text-slate-500">
                  At least 8 characters.
                </p>
              )}
            </div>

            <button className="btn-primary w-full" disabled={busy}>
              {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            {register ? "Already have an account? " : "New to DriveLedger? "}
            <button
              type="button"
              className="font-semibold text-teal-800 underline underline-offset-4"
              disabled={busy}
              onClick={() => {
                setRegister(!register);
                setPassword("");
                setError("");
              }}
            >
              {register ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
