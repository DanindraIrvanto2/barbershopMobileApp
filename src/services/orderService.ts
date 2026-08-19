import api from './api';
import type { Order } from '../types/order';

export interface CreateOrderPayload {
  customerId: number;
  kapsterId: number;
  serviceIds: number[];
  serviceStatus?: 'waiting' | 'in_service' | 'completed';
  paymentStatus?: 'unpaid' | 'paid';
  checkInTime?: string;
  notes?: string;
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>('/orders', payload);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, serviceStatus: string): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${orderId}`, { serviceStatus });
    return response.data;
  },

  updatePaymentStatus: async (
    orderId: number,
    paymentStatus: string,
    paymentDetails?: {
      paymentMethod?: string;
      amountReceived?: number;
      changeAmount?: number;
    }
  ): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${orderId}`, {
      paymentStatus,
      ...paymentDetails,
    });
    return response.data;
  },

  deleteOrder: async (orderId: number) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};
