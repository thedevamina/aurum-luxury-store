import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastContainer, useToast } from '@/admin/components/ui/Toast';
import { ToastContext } from '@/admin/context/ToastContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      <div className="min-h-screen bg-ink-900">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-[calc(100vh-64px)] p-4 md:p-8"
          >
            {children}
          </motion.main>
        </div>
        <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
      </div>
    </ToastContext.Provider>
  );
}
