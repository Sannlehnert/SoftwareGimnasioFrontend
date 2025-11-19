import api from '../axios';

export const authService = {
  login: async (identifier: string, password: string) => {
    const { data } = await api.post('/auth/login', { identifier, password });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },
};