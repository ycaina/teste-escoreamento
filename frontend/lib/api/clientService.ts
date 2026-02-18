import api from './axios';

export interface Client {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  fullName: string;
  email: string;
  phone?: string;
  file: File;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export const clientService = {
  // Criar novo cliente (público)
  create: async (data: CreateClientData) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    if (data.phone) {
      formData.append('phone', data.phone);
    }
    formData.append('file', data.file);

    const response = await api.post('/clients', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Listar clientes (protegido)
  getAll: async (page = 1, limit = 10, search = '') => {
    const response = await api.get<{
      success: boolean;
      data: Client[];
      pagination: PaginationResponse;
    }>('/clients', {
      params: { page, limit, search }
    });
    return response.data;
  },

  // Buscar cliente por ID (protegido)
  getById: async (id: string) => {
    const response = await api.get<{
      success: boolean;
      data: Client;
    }>(`/clients/${id}`);
    return response.data;
  },

  // Atualizar cliente (protegido)
  update: async (id: string, data: Partial<Client>) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  // Deletar cliente (protegido)
  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }
};
