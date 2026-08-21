import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, Mail } from 'lucide-react';
import { notifications } from '@/admin/data/mockData';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-900/80 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-cream/60 hover:text-gold lg:hidden">
          <Menu size={22} />
        </button>
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            placeholder="Search..."
            className="w-64 border border-white/10 bg-white/[0.02] py-2 pl-10 pr-4 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none rounded-md transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/contact-messages" className="relative text-cream/60 hover:text-gold">
          <Mail size={20} />
        </Link>
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative text-cream/60 hover:text-gold"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-bold text-ink-900 rounded-full">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 z-50 w-80 glass-strong rounded-lg shadow-2xl"
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="text-sm font-medium text-cream">Notifications</p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className={`border-b border-white/5 px-4 py-3 hover:bg-white/[0.02] ${!n.read ? 'bg-gold/[0.03]' : ''}`}
                      >
                        <p className="text-sm text-cream">{n.title}</p>
                        <p className="mt-0.5 text-xs text-cream/40">{n.message}</p>
                        <p className="mt-1 text-[10px] text-cream/30">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block border-t border-white/10 px-4 py-3 text-center text-xs uppercase tracking-widest text-gold hover:text-gold-light"
                  >
                    View All
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10"
        >
          <span className="text-xs font-semibold text-gold">AU</span>
        </Link>
      </div>
    </header>
  );
}
