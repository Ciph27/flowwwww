export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module?: string;
  created_at: Date;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: Date;
}