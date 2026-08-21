import { Eye, Mail, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge } from '@/admin/components/ui/AdminUI';
import Drawer from '@/admin/components/ui/Drawer';
import AdminButton from '@/admin/components/ui/AdminButton';
import {
  fetchAdminCustomer,
  fetchAdminCustomers,
  type AdminCustomer,
  type AdminCustomerDetail,
} from '@/lib/products';

export default function Customers() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [selected, setSelected] = useState<AdminCustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      setCustomers(await fetchAdminCustomers());
    } catch {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const openCustomer = async (customer: AdminCustomer) => {
    setIsDetailLoading(true);
    try {
      setSelected(await fetchAdminCustomer(customer.id));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const columns: Column<AdminCustomer>[] = [
    {
      key: 'name', label: 'Customer', sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-xs text-gold">
            {c.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-cream">{c.name}</p>
            <p className="text-xs text-cream/40">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'order_count', label: 'Orders', sortable: true },
    { key: 'total_spent', label: 'Total Spent', sortable: true, render: (c) => `$${c.total_spent.toLocaleString()}` },
    { key: 'joined', label: 'Joined', sortable: true, render: (c) => c.joined ?? '—' },
  ];

  return (
    <div>
      <PageHeader title="Customers" subtitle={isLoading ? 'Loading...' : `${customers.length} registered customers`} />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={customers}
          columns={columns}
          searchKeys={['name', 'email']}
          searchPlaceholder="Search customers..."
          emptyMessage={isLoading ? 'Loading...' : 'No customers found'}
          actions={(item) => (
            <button onClick={() => openCustomer(item)} className="text-cream/40 hover:text-gold">
              <Eye size={16} />
            </button>
          )}
        />
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.customer.name || ''}>
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-lg text-gold">
                {selected.customer.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-serif text-xl text-cream">{selected.customer.name}</p>
                <p className="text-sm text-cream/40">{selected.customer.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <p className="font-serif text-2xl text-gold">{selected.customer.order_count}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">Orders</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <p className="font-serif text-2xl text-gold">${selected.customer.total_spent.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">Spent</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <p className="font-serif text-2xl text-gold">{selected.customer.joined ?? '—'}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">Joined</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-cream/40">Order History</p>
              <div className="space-y-3">
                {isDetailLoading ? (
                  <p className="text-sm text-cream/40">Loading order history...</p>
                ) : selected.orders.length ? (
                  selected.orders.map((order) => (
                    <div key={order.order_number} className="glass rounded-lg p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm text-cream">{order.order_number}</p>
                          <p className="text-xs text-cream/40">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-cream">${order.total.toLocaleString()}</p>
                          <StatusBadge status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-cream/40">No orders found.</p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <AdminButton variant="outline" className="flex-1"><Mail size={16} /> Email</AdminButton>
              <AdminButton className="flex-1"><ShoppingBag size={16} /> View Orders</AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
