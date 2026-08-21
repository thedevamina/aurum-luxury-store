import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
};

type AdminAuthContextType = {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAdminAccess = async () => {
    try {
      const me = await apiFetch<{ data: AdminUser }>('/api/me');
      // Confirm this user actually has admin/staff access by hitting a
      // real admin-only endpoint — never trust the client alone to decide this.
      await apiFetch('/api/admin/products?per_page=1');
      setAdmin(me.data);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const login = async (email: string, password: string) => {
    await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    await checkAdminAccess();
    if (!admin) {
      // login succeeded but the account isn't admin/staff — re-check state
      const me = await apiFetch<{ data: AdminUser }>('/api/me').catch(() => null);
      throw new Error(
        me ? 'This account does not have admin access.' : 'Login failed.'
      );
    }
  };

  const logout = async () => {
    await apiFetch('/api/logout', { method: 'POST' });
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}