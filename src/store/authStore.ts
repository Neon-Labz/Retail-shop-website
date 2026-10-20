'use client';

import { create } from 'zustand';
import {
  getClientCookie,
  setClientCookie,
  deleteClientCookie,
  USER_COOKIE_NAME,
  ONE_DAY_SECONDS,
} from '@/lib/cookies';

export interface AuthUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: string;
  addresses?: any[];
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => {
    if (user) {
      setClientCookie(USER_COOKIE_NAME, JSON.stringify(user), ONE_DAY_SECONDS);
      try {
        localStorage.removeItem('customer_user');
      } catch {}
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      deleteClientCookie(USER_COOKIE_NAME);
      try {
        localStorage.removeItem('customer_user');
      } catch {}
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    // 1. Read from 1-day cookie first for instant hydration
    try {
      const stored = getClientCookie(USER_COOKIE_NAME);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          set({ user: parsed, isAuthenticated: true, isLoading: false });
        }
      }
    } catch {}

    // Clean up any legacy long-lived localStorage
    try {
      localStorage.removeItem('customer_user');
    } catch {}

    // 2. Authoritative check with server /api/auth/me (validates httpOnly 1-day auth_token)
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        // If server says 401 or token expired after 1 day, clear cookie and session
        deleteClientCookie(USER_COOKIE_NAME);
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setClientCookie(USER_COOKIE_NAME, JSON.stringify(data.user), ONE_DAY_SECONDS);
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        deleteClientCookie(USER_COOKIE_NAME);
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      deleteClientCookie(USER_COOKIE_NAME);
      try {
        localStorage.removeItem('customer_user');
      } catch {}
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
