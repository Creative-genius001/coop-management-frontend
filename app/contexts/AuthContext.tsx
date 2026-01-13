import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'member@coop.com': {
    id: '1',
    memberId: 'MEM001',
    name: 'John Adebayo',
    email: 'member@coop.com',
    role: 'member',
    phone: '+234 801 234 5678',
    joinDate: '2023-01-15',
    password: 'password123',
  },
  'admin@coop.com': {
    id: '2',
    memberId: 'ADM001',
    name: 'Sarah Okonkwo',
    email: 'admin@coop.com',
    role: 'admin',
    phone: '+234 802 345 6789',
    joinDate: '2022-06-01',
    password: 'admin123',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('coop_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem('coop_user');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = mockUsers[credentials.email];
    if (!mockUser || mockUser.password !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    const { password, ...user } = mockUser;
    localStorage.setItem('coop_user', JSON.stringify(user));
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('coop_user');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
