import api from './api';
import type { Customer } from '../types/order';

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  createCustomer: async (data: { name: string; phone: string }): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },
};
