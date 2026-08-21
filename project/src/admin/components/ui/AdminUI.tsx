import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: 'text-green-400 bg-green-500/10 border-green-500/20',
    Inactive: 'text-cream/40 bg-white/5 border-white/10',
    Pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    Processing: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Shipped: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    Delivered: 'text-green-400 bg-green-500/10 border-green-500/20',
    Cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
    Draft: 'text-cream/40 bg-white/5 border-white/10',
    Archived: 'text-cream/40 bg-white/5 border-white/10',
    Expired: 'text-red-400 bg-red-500/10 border-red-500/20',
    Scheduled: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Approved: 'text-green-400 bg-green-500/10 border-green-500/20',
    Rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
    Paid: 'text-green-400 bg-green-500/10 border-green-500/20',
    Refunded: 'text-red-400 bg-red-500/10 border-red-500/20',
    New: 'text-gold bg-gold/10 border-gold/20',
    Read: 'text-cream/40 bg-white/5 border-white/10',
    Replied: 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-widest border rounded ${colors[status] || colors.Inactive}`}>
      {status}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  delay?: number;
}) {
  const positive = change?.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-cream/40">{label}</p>
          <p className="mt-2 font-serif text-3xl text-cream">{value}</p>
          {change && (
            <p className={`mt-1 text-xs ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gold/20">
          <Icon size={22} className="text-gold" />
        </div>
      </div>
    </motion.div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="font-serif text-3xl text-cream md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-cream/40">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}

export function AdminInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">{label}</label>
      <input
        {...props}
        className="w-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none rounded-md transition-colors"
      />
    </div>
  );
}

export function AdminSelect({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">{label}</label>
      <select
        {...props}
        className="w-full border border-white/10 bg-ink-800 px-4 py-2.5 text-sm text-cream focus:border-gold focus:outline-none rounded-md transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-ink-800">{opt}</option>
        ))}
      </select>
    </div>
  );
}

export function AdminTextarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">{label}</label>
      <textarea
        {...props}
        className="w-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none rounded-md transition-colors resize-none"
      />
    </div>
  );
}

export function AdminSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="shimmer h-12 w-full rounded" />
      ))}
    </div>
  );
}
