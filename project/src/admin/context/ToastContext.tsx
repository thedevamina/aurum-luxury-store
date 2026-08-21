import { useContext, createContext } from 'react';
import { useToast, type ToastType } from '@/admin/components/ui/Toast';

export const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToastContext must be used within AdminLayout');
  return ctx;
}

export type { ToastType };
