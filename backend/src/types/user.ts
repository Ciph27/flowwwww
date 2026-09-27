export interface User {
  id: string;
  organization_id?: string;
  full_name: string;
  email: string;
  username: string;
  phone?: string;
  role_id?: string;
  department_id?: string;
  store_id?: string;
  active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDto {
  full_name: string;
  email: string;
  username: string;
  phone?: string;
  password: string;
  role_id?: string;
  department_id?: string;
  store_id?: string;
}

export interface UpdateUserDto {
  full_name?: string;
  email?: string;
  username?: string;
  phone?: string;
  role_id?: string;
  department_id?: string;
  store_id?: string;
  active?: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}