import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "driveledger-session";

function readSession() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return stored?.access_token && stored?.user?.email ? stored : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [sessionMessage, setSessionMessage] = useState("");

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  async function signIn(credentials, register = false) {
    if (register) {
      await api("/api/auth/register", {
        method: "POST",
        body: credentials,
      });
    }

    const result = await api("/api/auth/login", {
      method: "POST",
      body: credentials,
    });

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    setSessionMessage("");
    setSession(result);
  }

  useEffect(() => {
    function expired() {
      sessionStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setSessionMessage("Your session expired. Please sign in again.");
    }

    window.addEventListener("driveledger-session-expired", expired);
    return () => {
      window.removeEventListener("driveledger-session-expired", expired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      user: session?.user ?? null,
      token: session?.access_token ?? null,
      signIn,
      logout,
      sessionMessage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
