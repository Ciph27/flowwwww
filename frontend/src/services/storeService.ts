import api from './api';
import type { Store, CreateStoreDto, UpdateStoreDto } from '../types/store';

export const storeService = {
  async create(store: CreateStoreDto): Promise<Store> {
    const response = await api.post<Store>('/stores', store);
    return response.data;
  },

  async getAll(): Promise<Store[]> {
    const response = await api.get<Store[]>('/stores');
    return response.data;
  },

  async getById(id: string): Promise<Store> {
    const response = await api.get<Store>(`/stores/${id}`);
    return response.data;
  },

  async update(id: string, store: UpdateStoreDto): Promise<Store> {
    const response = await api.put<Store>(`/stores/${id}`, store);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/stores/${id}`);
  }
};