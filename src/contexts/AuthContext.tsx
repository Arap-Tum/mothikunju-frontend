import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Warehouse Clerk";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAdmin: boolean;
  isClerk: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string): User | null {
  try {
    const decoded: any = jwtDecode(token);
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return {
      id: decoded.user?.id || decoded.id || "",
      name: decoded.user?.name || decoded.name || "",
      email: decoded.user?.email || decoded.email || "",
      role: decoded.user?.role || decoded.role || "Warehouse Clerk",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("mwms_token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem("mwms_token");
    return t ? decodeToken(t) : null;
  });

  const login = (newToken: string) => {
    localStorage.setItem("mwms_token", newToken);
    setToken(newToken);
    setUser(decodeToken(newToken));
  };

  const logout = () => {
    localStorage.removeItem("mwms_token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (!decoded) logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAdmin: user?.role === "Admin",
        isClerk: user?.role === "Warehouse Clerk",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
