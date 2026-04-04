import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Receiving from "@/pages/Receiving";
import Dispatch from "@/pages/Dispatch";
import Orders from "@/pages/Orders";
import Picking from "@/pages/Picking";
import Packing from "@/pages/Packing";
import UsersPage from "@/pages/Users";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      
      {/* Dashboard - All authenticated users */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Orders - Sales Staff can create, others can view */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout><Orders /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Picking - Warehouse Manager, Picker */}
      <Route
        path="/picking"
        element={
          <ProtectedRoute requiredRoles={["Warehouse Manager", "Picker"]}>
            <AppLayout><Picking /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Packing - Warehouse Manager, Packer */}
      <Route
        path="/packing"
        element={
          <ProtectedRoute requiredRoles={["Warehouse Manager", "Packer"]}>
            <AppLayout><Packing /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Receiving - Warehouse Manager, Receiving Officer, Inventory Manager */}
      <Route
        path="/receive"
        element={
          <ProtectedRoute requiredRoles={[
            "Warehouse Manager",
            "Receiving Officer",
            "Inventory Manager",
          ]}>
            <AppLayout><Receiving /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Dispatch - Warehouse Manager, Dispatch Officer */}
      <Route
        path="/dispatch"
        element={
          <ProtectedRoute requiredRoles={["Warehouse Manager", "Dispatch Officer"]}>
            <AppLayout><Dispatch /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* User Management - Warehouse Manager only */}
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRoles="Warehouse Manager">
            <AppLayout><UsersPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
