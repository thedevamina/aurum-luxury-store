import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, LogIn, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader } from '@/admin/components/ui/AdminUI';
import { useToastContext } from '@/admin/context/ToastContext';
import { ApiError } from '@/lib/api';
import { fetchAdminActivityLogs, type AdminActivityLog } from '@/lib/products';

const typeConfig: Record<string, { color: string; icon: LucideIcon }> = {
  create: { color: 'text-green-400', icon: Plus },
  update: { color: 'text-blue-400', icon: Edit },
  delete: { color: 'text-red-400', icon: Trash2 },
  login: { color: 'text-gold', icon: LogIn },
  logout: { color: 'text-cream/40', icon: LogOut },
};

function getActivityType(action: string): keyof typeof typeConfig {
  if (action.endsWith('.created')) {
    return 'create';
  }

  if (action.endsWith('.updated')) {
    return 'update';
  }

  if (action.endsWith('.deleted')) {
    return 'delete';
  }

  if (action === 'login') {
    return 'login';
  }

  if (action === 'logout') {
    return 'logout';
  }

  return 'update';
}

function formatTarget(log: AdminActivityLog): string {
  if (log.subject_type && log.subject_id) {
    const type = log.subject_type.split('\\').pop() ?? log.subject_type;
    return `${type} #${log.subject_id}`;
  }

  return log.action;
}

export default function ActivityLogs() {
  const { show } = useToastContext();
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActivityLogs = async () => {
    setIsLoading(true);
    try {
      setActivityLogs(await fetchAdminActivityLogs());
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to load activity logs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivityLogs();
  }, []);

  const columns: Column<AdminActivityLog>[] = [
    {
      key: 'action', label: 'Type',
      render: (log) => {
        const cfg = typeConfig[getActivityType(log.action)];
        const Icon = cfg.icon;
        return (
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10`}>
            <Icon size={14} className={cfg.color} />
          </div>
        );
      },
    },
    {
      key: 'action', label: 'Action', sortable: true,
      render: (log) => (
        <div>
          <p className="text-cream">{log.action}</p>
          <p className="text-xs text-gold">{formatTarget(log)}</p>
        </div>
      ),
    },
    { key: 'user', label: 'User', sortable: true, render: (log) => log.user?.name ?? 'System' },
    { key: 'created_at', label: 'Time', sortable: true, render: (log) => new Date(log.created_at).toLocaleString() },
  ];

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle={isLoading ? 'Loading...' : `${activityLogs.length} recent activities`} />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={activityLogs}
          columns={columns}
          searchKeys={['action', 'subject_type', 'ip_address']}
          searchPlaceholder="Search logs..."
          emptyMessage={isLoading ? 'Loading...' : 'No activity logs found'}
        />
      </div>

      {/* Timeline view */}
      <div className="mt-6 glass rounded-lg p-6">
        <h3 className="mb-6 font-serif text-xl text-cream">Activity Timeline</h3>
        <div className="space-y-4">
          {activityLogs.slice(0, 6).map((log, i) => {
            const cfg = typeConfig[getActivityType(log.action)];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 border-l-2 border-white/10 pl-4 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 -ml-8 bg-ink-800">
                  <Icon size={14} className={cfg.color} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-cream">
                    <span className="text-gold">{log.user?.name ?? 'System'}</span> {log.action.toLowerCase()} <span className="text-cream/60">{formatTarget(log)}</span>
                  </p>
                  <p className="text-xs text-cream/30">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
