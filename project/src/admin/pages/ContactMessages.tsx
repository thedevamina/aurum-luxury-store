import { useEffect, useState } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader, StatusBadge } from '@/admin/components/ui/AdminUI';
import Drawer from '@/admin/components/ui/Drawer';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import { ApiError } from '@/lib/api';
import {
  fetchAdminContactMessages,
  markAdminContactMessageAsRead,
  deleteAdminContactMessage,
  type AdminContactMessage,
} from '@/lib/products';

export default function ContactMessages() {
  const { show } = useToastContext();
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<AdminContactMessage | null>(null);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      setMessages(await fetchAdminContactMessages());
    } catch {
      show('Failed to load contact messages', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (message: AdminContactMessage) => {
    setSelected(message);

    if (!message.is_read) {
      try {
        await markAdminContactMessageAsRead(message.id);
        await loadMessages();
        setSelected((current) => (current ? { ...current, is_read: true } : current));
      } catch (err) {
        show(err instanceof ApiError ? err.message : 'Failed to mark message as read', 'error');
      }
    }
  };

  const handleDelete = async (message: AdminContactMessage) => {
    if (!confirm(`Delete message from "${message.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminContactMessage(message.id);
      show('Message deleted');
      setSelected(null);
      await loadMessages();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to delete message', 'error');
    }
  };

  return (
    <div>
      <PageHeader
        title="Contact Messages"
        subtitle={isLoading ? 'Loading...' : `${messages.filter((message) => !message.is_read).length} new messages`}
      />

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => openMessage(msg)}
            className={`glass rounded-lg p-4 cursor-pointer transition-colors hover:bg-white/[0.03] ${!msg.is_read ? 'border-l-2 border-l-gold' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/10">
                <Mail size={18} className="text-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-cream">{msg.name}</p>
                    <p className="text-xs text-cream/40">{msg.email}</p>
                  </div>
                  <StatusBadge status={msg.is_read ? 'Read' : 'New'} />
                </div>
                <p className="mt-2 text-sm text-cream/60">{msg.subject}</p>
                <p className="mt-1 text-xs text-cream/40 line-clamp-1">{msg.message}</p>
                <p className="mt-1 text-[10px] text-cream/30">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.subject || ''}>
        {selected && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                  <span className="text-sm text-gold">{selected.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <p className="text-cream">{selected.name}</p>
                  <p className="text-xs text-cream/40">{selected.email}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">Subject</p>
              <p className="text-cream">{selected.subject}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">Message</p>
              <p className="text-sm leading-relaxed text-cream/60">{selected.message}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">Date</p>
              <p className="text-sm text-cream">{new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-widest text-cream/40">Status</p>
              <StatusBadge status={selected.is_read ? 'Read' : 'New'} />
            </div>
            <div className="flex gap-3">
              <AdminButton variant="outline" className="flex-1" onClick={() => handleDelete(selected)}>
                <Trash2 size={16} /> Delete
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
