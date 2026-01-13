export type UserRole = 'member' | 'admin';

export interface User {
  id: string;
  memberId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  joinDate: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
