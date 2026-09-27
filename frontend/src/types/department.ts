export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
  active?: boolean;
}