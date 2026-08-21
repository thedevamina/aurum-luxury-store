import { AlertTriangle, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatCard } from '@/admin/components/ui/AdminUI';
import { products, type Product } from '@/admin/data/mockData';

export default function Inventory() {
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 15);
  const outOfStock = products.filter((p) => p.stock === 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const columns: Column<Product>[] = [
    {
      key: 'name', label: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
          <div>
            <p className="text-cream">{p.name}</p>
            <p className="text-xs text-cream/40">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'stock', label: 'Stock Level', sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock <= 15 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min((p.stock / 60) * 100, 100)}%` }}
            />
          </div>
          <span className={`text-sm ${p.stock === 0 ? 'text-red-400' : p.stock <= 15 ? 'text-yellow-400' : 'text-cream/70'}`}>
            {p.stock}
          </span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (p) => (
        <span className={`text-xs uppercase tracking-widest ${p.stock === 0 ? 'text-red-400' : p.stock <= 15 ? 'text-yellow-400' : 'text-green-400'}`}>
          {p.stock === 0 ? 'Out of Stock' : p.stock <= 15 ? 'Low Stock' : 'In Stock'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Track and manage stock levels" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Total Units" value={String(totalStock)} delay={0} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={String(lowStock.length)} delay={0.1} />
        <StatCard icon={AlertTriangle} label="Out of Stock" value={String(outOfStock.length)} delay={0.2} />
      </div>

      {lowStock.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center gap-3 border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 rounded-lg"
        >
          <AlertTriangle size={18} className="text-yellow-400" />
          <p className="text-sm text-yellow-400">{lowStock.length} products are running low on stock. Consider restocking soon.</p>
        </motion.div>
      )}

      <div className="mt-6 glass rounded-lg p-6">
        <DataTable
          data={products}
          columns={columns}
          searchKeys={['name', 'sku']}
          searchPlaceholder="Search inventory..."
        />
      </div>
    </div>
  );
}
