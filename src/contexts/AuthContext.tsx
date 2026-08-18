'use client';

import { createContext, use, useEffect, useState, ReactNode, useCallback, memo } from 'react';

// @project
import { AUTH_USER_KEY } from '@/config';

// @types
import { User } from '@/types/auth';

type AuthContextType = {
  user: User | null;
  isProcessing: boolean;
};

/***************************  AUTH - CONTEXT & PROVIDER  ***************************/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderComponent = function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(true);

  const manageUserData = useCallback((localStorageData: string | null) => {
    try {
      const parsedAuthData = localStorageData ? JSON.parse(localStorageData) : null;
      if (parsedAuthData?.token) {
        setUser(parsedAuthData as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Error parsing auth data:', error);
      setUser(null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const localStorageData = localStorage.getItem(AUTH_USER_KEY);
    manageUserData(localStorageData);

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === AUTH_USER_KEY) {
        manageUserData(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [manageUserData]);

  return <AuthContext value={{ user, isProcessing }}>{children}</AuthContext>;
};

export const AuthProvider = memo(AuthProviderComponent);

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
