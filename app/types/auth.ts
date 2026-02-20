export type UserRole = 'member' | 'admin';

export interface User {
  id: string,
  memberId: string,
  email: string,
  firstname: string,
  lastname: string,
  role: UserRole,
  joinedAt: string,
  account: {
    id: string,
    balance: number
  }
}

export interface LoginResponse {
    message: string,
    data: {
        id: string,
        memberId: string,
        email: string,
        firstname: string,
        lastname: string,
        role: UserRole,
        accessToken: string,
        account: {
            id: string,
            balance: number
        }
    }
}

export interface SignupResponse {
    message: string,
    data: {
        id: string,
        memberId: string,
        email: string,
        firstname: string,
        lastname: string,
        role: UserRole,
        accessToken: string,
        account: {
            id: string,
            balance: number
        }
    }
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
