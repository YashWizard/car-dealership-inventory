import { useAuth } from "./auth/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <AuthPage />;
}
