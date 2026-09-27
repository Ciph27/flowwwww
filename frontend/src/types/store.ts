export interface Store {
  id: string;
  name: string;
  code: string;
  location?: string;
  pos_enabled: boolean;
  active: boolean;
  department_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStoreDto {
  name: string;
  code: string;
  location?: string;
  pos_enabled?: boolean;
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