import api from './api';
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from '../types/department';

export const departmentService = {
  async create(department: CreateDepartmentDto): Promise<Department> {
    const response = await api.post<Department>('/departments', department);
    return response.data;
  },

  async getAll(): Promise<Department[]> {
    const response = await api.get<Department[]>('/departments');
    return response.data;
  },

  async getById(id: string): Promise<Department> {
    const response = await api.get<Department>(`/departments/${id}`);
    return response.data;
  },

  async update(id: string, department: UpdateDepartmentDto): Promise<Department> {
    const response = await api.put<Department>(`/departments/${id}`, department);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  }
};