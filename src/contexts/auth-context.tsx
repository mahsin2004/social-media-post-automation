'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAuthToken, 
  getUserInfo, 
  setAuthToken, 
  setUserInfo, 
  clearAuthCookies, 
  isAuthenticated 
} from '@/lib/cookies';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  register: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = () => {
      try {
        if (isAuthenticated()) {
          const userInfo = getUserInfo() as User;
          if (userInfo) {
            setUser(userInfo);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearAuthCookies();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setAuthToken(token);
    setUserInfo(userData);
    setUser(userData);
    router.push('/dashboard');
  };

  const register = (token: string, userData: User) => {
    setAuthToken(token);
    setUserInfo(userData);
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};