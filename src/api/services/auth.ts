import api from '../axios';

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  alumnoId?: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('🔐 Intentando login con:', credentials);
    console.log('🔍 URL completa:', api.defaults.baseURL + '/auth/login');
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login exitoso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en login:', error.response?.data);
      console.error('❌ Status code:', error.response?.status);
      console.error('❌ Headers enviados:', error.config?.headers);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
