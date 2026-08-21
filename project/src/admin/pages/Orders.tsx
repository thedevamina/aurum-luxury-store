import { useEffect, useState } from 'react';
import { Eye, Package } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge, AdminSelect } from '@/admin/components/ui/AdminUI';
import Drawer from '@/admin/components/ui/Drawer';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
  type AdminOrder,
  type AdminOrderStatus,
} from '@/lib/products';
import { ApiError } from '@/lib/api';

const STATUS_OPTIONS: AdminOrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Orders() {
  const { show } = useToastContext();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [newStatus, setNewStatus] = useState<AdminOrderStatus>('pending');
  const [isSaving, setIsSaving] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      setOrders(await fetchAdminOrders());
    } catch {
      show('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const openOrder = (o: AdminOrder) => {
    setSelected(o);
    setNewStatus(o.status);
  };

  const handleUpdateStatus = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const updated = await updateAdminOrderStatus(selected.order_number, newStatus);
      show('Order status updated');
      setSelected(updated);
      await loadOrders();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to update status', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<AdminOrder>[] = [
    { key: 'order_number', label: 'Order ID', sortable: true, render: (o) => <span className="text-gold">{o.order_number}</span> },
    { key: 'customer', label: 'Customer', sortable: false, render: (o) => o.customer.name },
    {
      key: 'created_at', label: 'Date', sortable: true,
      render: (o) => new Date(o.created_at).toLocaleDateString(),
    },
    { key: 'items', label: 'Items', sortable: false, render: (o) => o.items.length },
    { key: 'total', label: 'Total', sortable: true, render: (o) => `$${o.total.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (o) => <StatusBadge status={o.status} /> },
  ];

  const selectedSubtotal = selected ? selected.subtotal.toLocaleString() : '0';
  const selectedDiscount = selected ? selected.discount_amount.toLocaleString() : '0';
  const selectedShipping = selected ? selected.shipping_cost.toLocaleString() : '0';

  return (
    <div>
      <PageHeader title="Orders" subtitle={isLoading ? 'Loading...' : `${orders.length} orders`} />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={orders}
          columns={columns}
          searchKeys={['order_number']}
          searchPlaceholder="Search orders..."
          emptyMessage={isLoading ? 'Loading...' : 'No orders found'}
          actions={(item) => (
            <button onClick={() => openOrder(item)} className="text-cream/40 hover:text-gold">
              <Eye size={16} />
            </button>
          )}
        />
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected ? `Order ${selected.order_number}` : ''}>
        {selected && (
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-cream/40 mb-2">Customer</p>
              <p className="text-cream">{selected.customer.name}</p>
              <p className="text-sm text-cream/50">{selected.customer.email}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-cream/40">Created</p>
              <p className="text-sm text-cream/60">{new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-cream/40 mb-2">Shipping Address</p>
              <p className="text-sm text-cream">{selected.shipping.name}</p>
              <p className="text-sm text-cream/60">{selected.shipping.address_line1}</p>
              {selected.shipping.address_line2 && <p className="text-sm text-cream/60">{selected.shipping.address_line2}</p>}
              <p className="text-sm text-cream/60">
                {selected.shipping.city}, {selected.shipping.postal_code}, {selected.shipping.country}
              </p>
              {selected.shipping.phone && <p className="text-sm text-cream/60">{selected.shipping.phone}</p>}
            </div>
            <div className="border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-widest text-cream/40 mb-2">Order Items</p>
              <div className="space-y-3">
                {selected.items.map((item) => (
                  <div key={item.id} className="glass rounded-lg p-4 flex items-center gap-3">
                    <Package size={20} className="text-gold" />
                    <div className="flex-1">
                      <p className="text-sm text-cream">{item.product_name}</p>
                      <p className="text-xs text-cream/40">
                        Qty: {item.quantity}
                        {item.color && ` · ${item.color}`}
                        {item.size && ` · ${item.size}`}
                      </p>
                    </div>
                    <p className="text-cream">${item.line_total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-lg">
                <span className="text-cream/60">Total</span>
                <span className="text-cream">${selected.total.toLocaleString()}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3 text-xs uppercase tracking-widest text-cream/45">
                <div>
                  <p className="mb-1">Subtotal</p>
                  <p className="text-cream/70 normal-case tracking-normal">${selectedSubtotal}</p>
                </div>
                <div>
                  <p className="mb-1">Shipping</p>
                  <p className="text-cream/70 normal-case tracking-normal">${selectedShipping}</p>
                </div>
                <div>
                  <p className="mb-1">Discount</p>
                  <p className="text-cream/70 normal-case tracking-normal">-${selectedDiscount}</p>
                </div>
              </div>
            </div>
            {selected.coupon_code && (
              <div>
                <p className="text-xs uppercase tracking-widest text-cream/40 mb-2">Coupon</p>
                <p className="text-sm text-cream">{selected.coupon_code}</p>
              </div>
            )}
            <div>
              <AdminSelect
                label="Order Status"
                options={STATUS_OPTIONS.map((status) => STATUS_LABELS[status])}
                value={STATUS_LABELS[newStatus]}
                onChange={(e) => {
                  const nextStatus = STATUS_OPTIONS.find((status) => STATUS_LABELS[status] === e.target.value);
                  if (nextStatus) setNewStatus(nextStatus);
                }}
              />
            </div>
            <div className="flex gap-3">
              <AdminButton variant="outline" className="flex-1" onClick={() => setSelected(null)}>Close</AdminButton>
              <AdminButton className="flex-1" onClick={handleUpdateStatus} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Update Status'}
              </AdminButton>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}