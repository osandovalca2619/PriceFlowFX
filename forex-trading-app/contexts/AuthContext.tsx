// forex-trading-app/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/lib/api/authService';
import { priceService } from '@/lib/api/priceService';

// Usar las interfaces que ya tienes en tu authService
interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  profileId: number;
  salesGroupId: number | null;
  status: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authService.getUser();
        const token = authService.getToken();

        if (token && savedUser) {
          // Verificar si el token sigue siendo válido
          const isValid = await authService.validateToken();
          if (isValid) {
            setUser(savedUser);
            // Configurar el servicio de precios con el token
            priceService.setAuthToken(token);
          } else {
            // Token inválido, limpiar
            authService.logout();
            priceService.disconnect();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        priceService.disconnect();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.login(credentials);
      setUser(response.user);

      // Configurar el servicio de precios con el token
      priceService.setAuthToken(response.access_token);
      
      console.log('✅ Login successful:', response.user.username);
    } catch (error: any) {
      setError(error.message || 'Error de autenticación');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    priceService.disconnect();
    setUser(null);
    setError(null);
    console.log('👋 Logged out successfully');
  };

  const clearError = () => {
    setError(null);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      await authService.changePassword(currentPassword, newPassword);
    } catch (error: any) {
      setError(error.message || 'Error al cambiar contraseña');
      throw error;
    }
  };

  const contextValue: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    error,
    clearError,
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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