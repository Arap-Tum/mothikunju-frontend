import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User, UserRole, AuthResponse } from "@/types";
import { authService } from "@/lib/services";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<AuthResponse>;
  updateProfile: (user: User) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  isWarehouseManager: boolean;
  isInventoryManager: boolean;
  isPicker: boolean;
  isPacker: boolean;
  isDispatchOfficer: boolean;
  isReceivingOfficer: boolean;
  isSalesStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions mapping
const rolePermissions: Record<UserRole, string[]> = {
  "Warehouse Manager": [
    "manage_users",
    "manage_inventory",
    "assign_tasks",
    "view_reports",
    "approve_operations",
    "conduct_audits",
  ],
  "Inventory Manager": [
    "manage_inventory",
    "view_inventory",
    "conduct_audits",
    "view_reports",
    "view_stock_history",
  ],
  Picker: ["view_orders", "pick_items", "view_assigned_orders"],
  Packer: ["view_orders", "pack_items", "view_assigned_orders"],
  "Dispatch Officer": [
    "view_orders",
    "dispatch_orders",
    "generate_tracking",
    "confirm_shipments",
  ],
  "Receiving Officer": [
    "receive_goods",
    "update_inventory",
    "inspect_goods",
    "view_receiving",
  ],
  "Sales Staff": ["create_orders", "view_own_orders", "track_orders", "check_inventory"],
};

function decodeToken(token: string): User | null {
  try {
    const decoded: any = jwtDecode(token);
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return {
      _id: decoded.user?._id || decoded._id || "",
      name: decoded.user?.name || decoded.name || "",
      email: decoded.user?.email || decoded.email || "",
      role: (decoded.user?.role || decoded.role || "Sales Staff") as UserRole,
      department: decoded.user?.department || decoded.department || "Warehouse",
      isActive: decoded.user?.isActive !== false,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem("token");
    return t ? decodeToken(t) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.register(data);
      setToken(response.token);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      if (Array.isArray(roles)) {
        return roles.includes(user.role);
      }
      return user.role === roles;
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      const permissions = rolePermissions[user.role] || [];
      return permissions.includes(permission);
    },
    [user]
  );

  // Validate token expiry
  useEffect(() => {
    if (token) {
      const decoded = decodeToken(token);
      if (!decoded) {
        logout();
      }
    }
  }, [token, logout]);

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateProfile,
    hasRole,
    hasPermission,
    isWarehouseManager: user?.role === "Warehouse Manager",
    isInventoryManager: user?.role === "Inventory Manager",
    isPicker: user?.role === "Picker",
    isPacker: user?.role === "Packer",
    isDispatchOfficer: user?.role === "Dispatch Officer",
    isReceivingOfficer: user?.role === "Receiving Officer",
    isSalesStaff: user?.role === "Sales Staff",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
