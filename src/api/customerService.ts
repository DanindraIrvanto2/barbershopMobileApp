import api from './api';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  created_at?: string;
  createdAt?: string;
}

export interface CustomerPayload {
  name: string;
  phone: string;
}

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.log('customerService getCustomers error:', error);
      throw error;
    }
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.log('customerService getCustomerById error:', error);
      throw error;
    }
  },


  createCustomer: async (payload: CustomerPayload): Promise<Customer> => {
    try {
      const response = await api.post('/customers', payload);
      return response.data;
    } catch (error) {
      console.log('customerService createCustomer error:', error);
      throw error;
    }
  },

  updateCustomer: async (id: number, payload: CustomerPayload): Promise<Customer> => {
    try {
      const response = await api.put(`/customers/${id}`, payload);
      return response.data;
    } catch (error) {
      console.log('customerService updateCustomer error:', error);
      throw error;
    }
  },

  deleteCustomer: async (id: number): Promise<{ message: string; id: number }> => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.log('customerService deleteCustomer error:', error);
      throw error;
    }
  },
};
