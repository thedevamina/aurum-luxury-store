import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Toast({ message, show }: { message: string; show: boolean }) {
  useEffect(() => {
    // no-op, controlled by parent
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-8 left-1/2 z-[100] glass-strong flex items-center gap-3 px-6 py-4 shadow-2xl"
        >
          <CheckCircle2 size={20} className="text-gold" />
          <span className="text-sm text-cream">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
