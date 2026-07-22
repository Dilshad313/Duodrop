// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
      } else {
        setCustomer(null);
      }
    } catch (error) {
      console.error('Refresh customer error:', error);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || data.errors?.[0] || 'Login failed' };
      }

      await refreshCustomer();
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Something went wrong' };
    } finally {
      setLoading(false);
    }
  }, [refreshCustomer]);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || data.errors?.[0] || 'Registration failed' };
      }

      await refreshCustomer();
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Something went wrong' };
    } finally {
      setLoading(false);
    }
  }, [refreshCustomer]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCustomer(null);
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || data.errors?.[0] || 'Failed to send reset email' };
      }

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Something went wrong' };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        refreshCustomer,
      }}
    >
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