export interface User {
  id: string;
  full_name: string;
  email: string;
  username: string;
  role_id?: string;
  department_id?: string;
  store_id?: string;
  active: boolean;
  last_login?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}