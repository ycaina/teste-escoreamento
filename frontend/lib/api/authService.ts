import api from './axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'operator';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'operator';
}

export const authService = {
  // Login
  login: async (data: LoginData) => {
    const response = await api.post<{
      success: boolean;
      data: {
        user: User;
        token: string;
      };
    }>('/auth/login', data);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Registro
  register: async (data: RegisterData) => {
    const response = await api.post<{
      success: boolean;
      data: {
        user: User;
        token: string;
      };
    }>('/auth/register', data);
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get<{
      success: boolean;
      data: {
        user: User;
      };
    }>('/auth/verify');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};
