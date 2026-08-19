import api from './api';
import type { Service } from '../types/order';

export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    const response = await api.get<Service[]>('/services');
    return response.data;
  },
};
