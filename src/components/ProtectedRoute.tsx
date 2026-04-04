import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface Props {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermission?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermission,
}: Props) {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
