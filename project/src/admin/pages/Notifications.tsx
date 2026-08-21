import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, ShoppingCart, Star, User, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/admin/components/ui/AdminUI';
import { useToastContext } from '@/admin/context/ToastContext';
import { notifications as initialNotifications, type Notification } from '@/admin/data/mockData';

const typeConfig: Record<string, { icon: LucideIcon; color: string }> = {
  order: { icon: ShoppingCart, color: 'text-gold' },
  review: { icon: Star, color: 'text-yellow-400' },
  system: { icon: Settings, color: 'text-blue-400' },
  customer: { icon: User, color: 'text-green-400' },
};

export default function Notifications() {
  const { show } = useToastContext();
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'all' ? items : items.filter((n) => !n.read);

  const markRead = (id: number) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    show('Marked as read');
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    show('All marked as read');
  };

  const remove = (id: number) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    show('Notification removed', 'error');
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${items.filter((n) => !n.read).length} unread`}
        action={
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 border border-white/15 px-4 py-2.5 text-xs uppercase tracking-wider text-cream/60 hover:border-gold hover:text-gold rounded-md transition-colors"
          >
            <Check size={16} /> Mark All Read
          </button>
        }
      />

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        {(['all', 'unread'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-widest rounded-md transition-colors ${
              filter === f ? 'bg-gold text-ink-900' : 'text-cream/50 hover:text-cream'
            }`}
          >
            {f === 'all' ? 'All' : 'Unread'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((notif, i) => {
          const cfg = typeConfig[notif.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass rounded-lg p-4 ${!notif.read ? 'border-l-2 border-l-gold' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10">
                  <Icon size={18} className={cfg.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-cream">{notif.title}</p>
                      <p className="text-xs text-cream/50">{notif.message}</p>
                      <p className="mt-1 text-[10px] text-cream/30">{notif.time}</p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.read && (
                        <button onClick={() => markRead(notif.id)} className="text-cream/40 hover:text-gold">
                          <Check size={16} />
                        </button>
                      )}
                      <button onClick={() => remove(notif.id)} className="text-cream/40 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={48} className="mb-4 text-cream/20" />
          <p className="text-cream/40">No notifications</p>
        </div>
      )}
    </div>
  );
}
