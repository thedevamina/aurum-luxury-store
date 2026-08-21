import { motion } from 'framer-motion';
import { CreditCard, DollarSign, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { PageHeader, StatCard, StatusBadge } from '@/admin/components/ui/AdminUI';
import { BarChart } from '@/admin/components/ui/Charts';

const transactions = [
  { id: 'TXN-001', order: 'AUR-2026-001', customer: 'Eleanor Vance', amount: 2850, method: 'Visa •••• 4242', date: 'Jul 23, 2026', status: 'Paid' },
  { id: 'TXN-002', order: 'AUR-2026-002', customer: 'Marcus Bellini', amount: 1290, method: 'Mastercard •••• 5555', date: 'Jul 22, 2026', status: 'Paid' },
  { id: 'TXN-003', order: 'AUR-2026-003', customer: 'Sofia Chen', amount: 720, method: 'Amex •••• 1000', date: 'Jul 22, 2026', status: 'Pending' },
  { id: 'TXN-004', order: 'AUR-2026-004', customer: 'James Whitmore', amount: 4200, method: 'Visa •••• 7878', date: 'Jul 21, 2026', status: 'Pending' },
  { id: 'TXN-005', order: 'AUR-2026-005', customer: 'Amara Okafor', amount: 5340, method: 'PayPal', date: 'Jul 20, 2026', status: 'Paid' },
  { id: 'TXN-006', order: 'AUR-2026-006', customer: 'Henrik Larsen', amount: 320, method: 'Visa •••• 3333', date: 'Jul 19, 2026', status: 'Refunded' },
];

const paymentMethods = [
  { name: 'Credit Card', icon: CreditCard, enabled: true, transactions: 1240 },
  { name: 'PayPal', icon: DollarSign, enabled: true, transactions: 420 },
  { name: 'Apple Pay', icon: CreditCard, enabled: true, transactions: 180 },
  { name: 'Google Pay', icon: DollarSign, enabled: false, transactions: 0 },
];

const monthlyRevenue = [
  { label: 'Jan', value: 38000 }, { label: 'Feb', value: 34000 }, { label: 'Mar', value: 46000 },
  { label: 'Apr', value: 42000 }, { label: 'May', value: 58000 }, { label: 'Jun', value: 52000 },
  { label: 'Jul', value: 64000 }, { label: 'Aug', value: 61000 },
];

export default function Payments() {
  return (
    <div>
      <PageHeader title="Payments" subtitle="Manage payment methods and transactions" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Processed" value="$842K" change="+12.5%" delay={0} />
        <StatCard icon={CheckCircle2} label="Successful" value="1,840" change="+8.2%" delay={0.1} />
        <StatCard icon={Clock} label="Pending" value="24" delay={0.2} />
        <StatCard icon={XCircle} label="Refunded" value="12" delay={0.3} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Payment Revenue</h3>
          <BarChart data={monthlyRevenue} height={220} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((m, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <m.icon size={18} className="text-gold" />
                  <span className="text-sm text-cream">{m.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-cream/40">{m.transactions}</span>
                  <span className={`h-2 w-2 rounded-full ${m.enabled ? 'bg-green-400' : 'bg-cream/20'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 glass rounded-lg p-6"
      >
        <h3 className="mb-6 font-serif text-xl text-cream">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {['Transaction', 'Order', 'Customer', 'Amount', 'Method', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-widest text-cream/40">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-sm text-gold">{t.id}</td>
                  <td className="px-4 py-3 text-sm text-cream/70">{t.order}</td>
                  <td className="px-4 py-3 text-sm text-cream/70">{t.customer}</td>
                  <td className="px-4 py-3 text-sm text-cream">${t.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-cream/50">{t.method}</td>
                  <td className="px-4 py-3 text-sm text-cream/50">{t.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
