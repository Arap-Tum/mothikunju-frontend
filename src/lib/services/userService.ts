import { apiClient } from '../api-client';
import { User } from '@/types';

export const userService = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data || [];
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data!;
  },

  /**
   * Create new user
   */
  create: async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
  }): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data!;
  },

  /**
   * Update user
   */
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data!;
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data!
  },
};
