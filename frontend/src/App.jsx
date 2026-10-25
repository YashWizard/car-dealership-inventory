import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (user) return <DashboardPage />;

  if (showAuth) {
    return (
      <>
        <div className="border-b border-slate-200 bg-white px-6 py-3">
          <button
            type="button"
            className="text-sm font-semibold text-teal-800"
            onClick={() => setShowAuth(false)}
          >
            ← Back to DriveLedger
          </button>
        </div>
        <AuthPage />
      </>
    );
  }

  return (
    <LandingPage onSignIn={() => {
      setShowAuth(true);
      window.scrollTo(0, 0);
    }} />
  );
}
