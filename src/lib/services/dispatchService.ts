import { apiClient } from '../api-client';
import {
  Order,
  ShipmentRequest,
  BulkDispatchRequest,
} from '@/types';

export const dispatchService = {
  /**
   * Get packed orders ready for dispatch
   */
  getReadyForDispatch: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/dispatch/list/ready');
    return response.data || [];
  },

  /**
   * Get orders dispatched by current officer
   */
  getDispatched: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/dispatch/dispatched');
    return response.data || [];
  },

  /**
   * Get order dispatch details
   */
  getOrderDetails: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/dispatch/${orderId}/details`);
    return response.data!;
  },

  /**
   * Confirm shipment with tracking number
   */
  confirmShipment: async (
    orderId: string,
    data: ShipmentRequest
  ): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/dispatch/${orderId}/confirm-shipment`,
      data
    );
    return response.data!;
  },

  /**
   * Bulk approve and dispatch multiple orders
   */
  bulkDispatch: async (data: BulkDispatchRequest): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/dispatch/bulk/approve-dispatch',
      data
    );
    return response.data!
  },

  /**
   * Mark order as delivered
   */
  markDelivered: async (orderId: string): Promise<Order> => {
    const response = await apiClient.patch<Order>(
      `/dispatch/${orderId}/mark-delivered`
    );
    return response.data!;
  },
};
