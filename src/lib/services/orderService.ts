import { apiClient } from '../api-client';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
} from '@/types';

export const orderService = {
  /**
   * Get all orders
   */
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data || [];
  },

  /**
   * Get my orders (for Sales Staff)
   */
  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/my-orders');
    return response.data || [];
  },

  /**
   * Get order by ID
   */
  getById: async (orderId: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data!;
  },

  /**
   * Create new order
   */
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data!;
  },

  /**
   * Update order
   */
  update: async (orderId: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await apiClient.patch<Order>(`/orders/${orderId}`, data);
    return response.data!;
  },

  /**
   * Cancel order
   */
  cancel: async (orderId: string): Promise<Order> => {
    const response = await apiClient.delete<Order>(`/orders/${orderId}`);
    return response.data!;
  },
};
