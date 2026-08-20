import api from './api';

export interface LoginResponse {
  message: string;
  token?: string;
  user: {
    id: number;
    username: string;
    email: string;
    role?: string;
  };
}

export const authService = {
  login: async (inputEmail: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        email: inputEmail,
        password,
      });
      return response.data;
    } catch (error) {
      console.log('authService login error:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.log('authService getMe error:', error);
      throw error;
    }
  },
};
