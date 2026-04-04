import { apiClient } from '../api-client';
import {
  AuthResponse,
  User,
  CreateReceivingRequest,
  UpdateReceivingQuantitiesRequest,
  InspectReceivingRequest,
  RejectReceivingRequest,
  Receiving,
  ApiResponse,
} from '@/types';

export const receivingService = {
  /**
   * Get all receiving documents
   */
  getAll: async (): Promise<Receiving[]> => {
    const response = await apiClient.get<Receiving[]>('/receiving');
    return response.data || [];
  },

  /**
   * Get receiving document by ID
   */
  getById: async (id: string): Promise<Receiving> => {
    const response = await apiClient.get<Receiving>(`/receiving/${id}`);
    return response.data!;
  },

  /**
   * Create new receiving document
   */
  create: async (data: CreateReceivingRequest): Promise<Receiving> => {
    const response = await apiClient.post<Receiving>('/receiving', data);
    return response.data!;
  },

  /**
   * Update received quantities
   */
  updateQuantities: async (id: string, data: UpdateReceivingQuantitiesRequest): Promise<Receiving> => {
    const response = await apiClient.patch<Receiving>(
      `/receiving/${id}/update-quantities`,
      data
    );
    return response.data!;
  },

  /**
   * Inspect received goods
   */
  inspect: async (id: string, data: InspectReceivingRequest): Promise<Receiving> => {
    const response = await apiClient.patch<Receiving>(
      `/receiving/${id}/inspect`,
      data
    );
    return response.data!;
  },

  /**
   * Accept receiving (update inventory)
   */
  accept: async (id: string): Promise<Receiving> => {
    const response = await apiClient.patch<Receiving>(`/receiving/${id}/accept`);
    return response.data!;
  },

  /**
   * Reject receiving
   */
  reject: async (id: string, data: RejectReceivingRequest): Promise<Receiving> => {
    const response = await apiClient.patch<Receiving>(
      `/receiving/${id}/reject`,
      data
    );
    return response.data!;
  },
};
