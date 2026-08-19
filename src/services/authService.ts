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
  login: async (emailOrUsername: string, password: string):Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: emailOrUsername,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
