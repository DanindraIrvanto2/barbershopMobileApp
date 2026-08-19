import api from './api';
import type { Kapster } from '../types/order';

export const kapsterService = {
  getKapsters: async (): Promise<Kapster[]> => {
    const response = await api.get<Kapster[]>('/kapsters');
    return response.data;
  },
};
