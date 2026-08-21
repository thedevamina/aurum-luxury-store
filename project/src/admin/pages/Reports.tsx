import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { PageHeader, StatCard } from '@/admin/components/ui/AdminUI';
import { LineChart, BarChart, DonutChart } from '@/admin/components/ui/Charts';
import { revenueData, ordersData, categoryDistribution, weeklyTraffic } from '@/admin/data/mockData';
import { ApiError } from '@/lib/api';
import { fetchAdminSalesReport, type AdminSalesReport } from '@/lib/products';

export default function Reports() {
  const [report, setReport] = useState<AdminSalesReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setIsLoading(true);
      try {
        setReport(await fetchAdminSalesReport());
      } catch (error) {
        // Keep the page usable even if the report endpoint fails.
        console.error(error instanceof ApiError ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  const summary = report?.summary;

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle={isLoading ? 'Loading...' : 'Performance metrics and insights'} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Revenue (YTD)" value={`$${(summary?.total_revenue ?? 0).toLocaleString()}`} change="Live data" delay={0} />
        <StatCard icon={ShoppingCart} label="Orders (YTD)" value={String(summary?.total_orders ?? 0)} change="Live data" delay={0.1} />
        <StatCard icon={Users} label="Avg. Order Value" value={`$${(summary?.average_order_value ?? 0).toLocaleString()}`} change="Live data" delay={0.2} />
        <StatCard icon={Package} label="Low Stock Items" value={String(report?.low_stock.length ?? 0)} change="Live data" delay={0.3} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-lg p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-cream">Revenue Trend</h3>
            <TrendingUp size={20} className="text-gold" />
          </div>
          <LineChart data={revenueData} height={240} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-lg p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-cream">Orders Volume</h3>
            <ShoppingCart size={20} className="text-gold" />
          </div>
          <BarChart data={ordersData} height={240} />
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Category Distribution</h3>
          <DonutChart data={categoryDistribution} size={160} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-cream">Weekly Traffic</h3>
            <TrendingDown size={20} className="text-gold" />
          </div>
          <BarChart data={weeklyTraffic} height={200} />
        </motion.div>
      </div>

      {/* Top products table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 glass rounded-lg p-6"
      >
        <h3 className="mb-6 font-serif text-xl text-cream">Top Performing Products</h3>
        <div className="space-y-3">
          {(report?.top_products ?? []).map((p, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-gold">#{i + 1}</span>
                <span className="text-cream">{p.product_name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-cream">{p.total_sold} sales</p>
                <p className="text-xs text-cream/40">${p.total_revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 glass rounded-lg p-6"
      >
        <h3 className="mb-6 font-serif text-xl text-cream">Low Stock Alerts</h3>
        <div className="space-y-3">
          {(report?.low_stock ?? []).map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
              <span className="text-cream">{product.name}</span>
              <span className="text-xs text-red-400">{product.stock_quantity} left</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
