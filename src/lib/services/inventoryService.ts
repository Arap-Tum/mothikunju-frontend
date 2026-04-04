import { apiClient } from '../api-client';
import {
  Inventory,
  UpdateInventoryRequest,
} from '@/types';

export const inventoryService = {
  /**
   * Get all inventory items
   */
  getAll: async (): Promise<Inventory[]> => {
    const response = await apiClient.get<Inventory[]>('/inventory');
    return response.data || [];
  },

  /**
   * Get inventory by SKU
   */
  getBySku: async (sku: string): Promise<Inventory> => {
    const response = await apiClient.get<Inventory>(`/inventory/${sku}`);
    return response.data!;
  },

  /**
   * Create new inventory item
   */
  create: async (data: Omit<Inventory, '_id' | 'createdAt' | 'updatedAt'>): Promise<Inventory> => {
    const response = await apiClient.post<Inventory>('/inventory', data);
    return response.data!;
  },

  /**
   * Update inventory item
   */
  update: async (sku: string, data: UpdateInventoryRequest): Promise<Inventory> => {
    const response = await apiClient.patch<Inventory>(`/inventory/${sku}`, data);
    return response.data!;
  },

  /**
   * Delete inventory item
   */
  delete: async (sku: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/inventory/${sku}`);
    return response.data!
  },
};
