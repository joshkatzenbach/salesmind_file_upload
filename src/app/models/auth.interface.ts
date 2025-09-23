export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  access_level: 'user' | 'admin' | 'super_admin';
  query_permission: boolean;
  created_at: string;
  last_login: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface AuthError {
  detail: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  user: User | null;
  accessLevel: string | null;
}
