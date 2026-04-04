import { apiClient } from '../api-client';
import {
  Order,
  PickedItem,
  UpdatePickingStatusRequest,
  AssignPickingRequest,
} from '@/types';

export const pickingService = {
  /**
   * Get picklist (all pending orders)
   */
  getPendingList: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/picking/list/pending');
    return response.data || [];
  },

  /**
   * Get assigned picks for current picker
   */
  getAssignedPicks: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/picking/assigned');
    return response.data || [];
  },

  /**
   * Assign order to picker
   */
  assignToPicker: async (data: AssignPickingRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/picking/assign', data);
    return response.data!;
  },

  /**
   * Mark items as picked
   */
  markItemsAsPicked: async (
    orderId: string,
    pickedItems: PickedItem[]
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/picking/${orderId}/mark-picked`,
      { pickedItems }
    );
    return response.data!;
  },

  /**
   * Update picking status
   */
  updateStatus: async (
    orderId: string,
    data: UpdatePickingStatusRequest
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/picking/${orderId}/status`,
      data
    );
    return response.data!;
  },
};
