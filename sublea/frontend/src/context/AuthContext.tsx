import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '../api/client';
import { toast } from 'react-hot-toast';

export interface User {
  id: number;
  email: string;
  is_verified: boolean;
  age: number;
  gender: string;
  gender_preference?: string;
  first_name: string;
  last_name: string;
  created_at: string;
  profile_picture?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      try {
        const userData = await apiFetch('/api/users/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
        toast.error('Session expired or Invalid. Please log in again.');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
