import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, width = 'max-w-md' }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-ink-900/80 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed right-0 top-0 z-[101] h-full w-full ${width} glass-strong overflow-y-auto`}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-ink-800/80 px-6 py-4 backdrop-blur-xl">
              <h2 className="font-serif text-xl text-cream">{title}</h2>
              <button onClick={onClose} className="text-cream/40 hover:text-gold">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
