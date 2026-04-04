import { apiClient } from '../api-client';
import {
  Order,
  PackedItem,
  UpdatePackingStatusRequest,
  AssignPackingRequest,
} from '@/types';

export const packingService = {
  /**
   * Get orders ready for packing
   */
  getReadyForPacking: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/packing/list/ready');
    return response.data || [];
  },

  /**
   * Get assigned packing orders for current packer
   */
  getAssignedPacking: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/packing/assigned');
    return response.data || [];
  },

  /**
   * Get order details for packing
   */
  getOrderDetails: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/packing/${orderId}/details`);
    return response.data!;
  },

  /**
   * Assign order to packer
   */
  assignToPacker: async (data: AssignPackingRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/packing/assign', data);
    return response.data!;
  },

  /**
   * Confirm packed items
   */
  confirmPacked: async (
    orderId: string,
    packedItems: PackedItem[]
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/packing/${orderId}/confirm-packed`,
      { packedItems }
    );
    return response.data!;
  },

  /**
   * Update packing status
   */
  updateStatus: async (
    orderId: string,
    data: UpdatePackingStatusRequest
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/packing/${orderId}/status`,
      data
    );
    return response.data!;
  },
};
