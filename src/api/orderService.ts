import api from './api';

export interface OrderItem {
  id: number;
  name: string;
  price: string | number;
  duration?: number;
}

export interface Order {
  id: number;
  customerId: number;
  kapsterId: number;
  serviceStatus: 'waiting' | 'in_service' | 'completed';
  paymentStatus: 'unpaid' | 'paid';
  checkInTime: string;
  notes?: string;
  createdAt?: string;
  services?: OrderItem[];
  totalPrice?: number | string;
}

export interface CreateOrderPayload {
  customerId: number;
  kapsterId: number;
  serviceIds: number[];
  checkInTime: string;
  notes?: string;
  serviceStatus?: string;
  paymentStatus?: string;
}

export interface UpdateOrderPayload {
  serviceStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  amountReceived?: number;
  changeAmount?: number;
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.log('orderService getOrders error:', error);
      throw error;
    }
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    try {
      const response = await api.post('/orders', payload);
      return response.data;
    } catch (error) {
      console.log('orderService createOrder error:', error);
      throw error;
    }
  },

  updateOrder: async (id: number, payload: UpdateOrderPayload): Promise<Order> => {
    try {
      const response = await api.patch(`/orders/${id}`, payload);
      return response.data;
    } catch (error) {
      console.log('orderService updateOrder error:', error);
      throw error;
    }
  },

  deleteOrder: async (id: number): Promise<{ message: string; id: number }> => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.log('orderService deleteOrder error:', error);
      throw error;
    }
  },

  getServices: async (): Promise<any[]> => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      console.log('orderService getServices error:', error);
      throw error;
    }
  },
};
