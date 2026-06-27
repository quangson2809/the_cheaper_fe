import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthResponse } from '@/types/auth.types';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('authUser');
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const token = localStorage.getItem('accessToken');
  let isExpired = true;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    isExpired = payload.exp * 1000 < Date.now();
    console.log("Token", token);
    console.log("Expired token:", isExpired);

    if (isExpired) {
      clearAuth();
    }
  }

  const isAuthenticated = user !== null && !!localStorage.getItem('accessToken') && !isExpired;
  const isAdmin = user?.role === 'ADMIN';

  function setAuth(data: AuthResponse) {
    const authUser: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('authUser', JSON.stringify(authUser));
    setUser(authUser);
  }

  function clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('authUser');
    setUser(null);
  }

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === 'accessToken' && !e.newValue) {
        setUser(null);
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
}
