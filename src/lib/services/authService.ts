import { apiClient } from '../api-client';
import { AuthResponse, User } from '@/types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data!;
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data!;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data!;
  },

  /**
   * Logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    localStorage.removeItem('token');
    return response.data!;
  },

  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Set token in localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  /**
   * Remove token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
