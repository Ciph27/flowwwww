export interface Store {
  id: string;
  organization_id?: string;
  department_id?: string;
  name: string;
  code: string;
  location?: string;
  pos_enabled: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateStoreDto {
  name: string;
  code: string;
  location?: string;
  pos_enabled?: boolean;
  organization_id?: string;
  department_id?: string;
}

export interface UpdateStoreDto {
  name?: string;
  code?: string;
  location?: string;
  pos_enabled?: boolean;
  active?: boolean;
  department_id?: string;
}