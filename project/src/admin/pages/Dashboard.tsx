import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard, PageHeader, StatusBadge } from '@/admin/components/ui/AdminUI';
import { fetchAdminSalesReport, type AdminSalesReport } from '@/lib/products';

export default function Dashboard() {
  const [report, setReport] = useState<AdminSalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setIsLoading(true);
      try {
        setReport(await fetchAdminSalesReport());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  const summary = report?.summary;
  const ordersByStatus = summary?.orders_by_status ?? {};

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={isLoading ? 'Loading sales report...' : 'Live sales overview from the admin report API.'}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(summary?.total_revenue ?? 0).toLocaleString()}`} change="Live report" delay={0} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={String(summary?.total_orders ?? 0)} change="Live report" delay={0.1} />
        <StatCard icon={Users} label="Average Order Value" value={`$${(summary?.average_order_value ?? 0).toLocaleString()}`} change="Live report" delay={0.2} />
        <StatCard icon={Package} label="Low Stock Items" value={String(report?.low_stock.length ?? 0)} change="Live report" delay={0.3} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-cream">Orders by Status</h3>
              <p className="text-xs text-cream/40">Current distribution from the admin sales report</p>
            </div>
            <TrendingUp size={20} className="text-gold" />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.entries(ordersByStatus).map(([status, value]) => (
              <div key={status} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-[11px] uppercase tracking-widest text-cream/40">{status}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <StatusBadge status={status.charAt(0).toUpperCase() + status.slice(1)} />
                  <span className="font-serif text-2xl text-cream">{String(value)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Low Stock Alerts</h3>
          <div className="space-y-3">
            {(report?.low_stock ?? []).slice(0, 6).map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-sm text-cream">{product.name}</span>
                <span className="text-xs text-red-400">{product.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-cream">Top Performing Products</h3>
            <Link to="/orders" className="flex items-center gap-1 text-xs uppercase tracking-widest text-gold hover:text-gold-light">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {(report?.top_products ?? []).map((product, i) => (
              <motion.div
                key={product.product_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm text-cream">{product.product_name}</p>
                  <p className="text-xs text-cream/40">{product.total_sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-cream">${product.total_revenue.toLocaleString()}</p>
                  <p className="text-xs text-cream/40">Revenue</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-lg p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-cream">Low Stock Products</h3>
            <AlertTriangle size={20} className="text-gold" />
          </div>
          <div className="space-y-3">
            {(report?.low_stock ?? []).map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <span className="text-cream/80">{product.name}</span>
                <span className="text-xs text-cream/40">{product.stock_quantity} left</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
