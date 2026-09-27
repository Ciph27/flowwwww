export interface Department {
  id: string;
  organization_id?: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  organization_id?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
  active?: boolean;
}