import axios from "axios";

const API_BASE_URL = "https://muthokinju-warehouse-management-system.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mwms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("mwms_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post("/api/auth/register", data),
};

// Users (Admin)
export const usersApi = {
  getAll: () => api.get("/api/users"),
  updateRole: (id: string, role: string) =>
    api.patch(`/api/users/${id}`, { role }),
};

// Inventory
export const inventoryApi = {
  getAll: () => api.get("/api/inventory"),
  create: (data: any) => api.post("/api/inventory", data),
  update: (sku: string, data: any) => api.patch(`/api/inventory/${sku}`, data),
};

// Stock movements
export const stockApi = {
  receive: (data: any) => api.post("/api/stock/receive", data),
  dispatch: (data: { sku: string; quantity: number }) =>
    api.post("/api/stock/dispatch", data),
  history: () => api.get("/api/stock/history"),
};

// Dashboard
export const dashboardApi = {
  get: () => api.get("/api/dashboard"),
};

export default api;
