import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Check, Clock, Truck } from 'lucide-react';
import { apiFetch } from '@/lib/api';

type ApiOrderItem = {
  id: number;
  product_id: number | null;
  product_name: string;
  price: number;
  color: string | null;
  size: string | null;
  quantity: number;
  line_total: number;
};

type ApiOrder = {
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  items: ApiOrderItem[];
  created_at: string;
};

type OrdersResponse = {
  data: ApiOrder[];
};

const statusStyles: Record<string, { color: string; icon: typeof Check; label: string }> = {
  pending: { color: 'text-blue-400', icon: Clock, label: 'Processing' },
  processing: { color: 'text-blue-400', icon: Clock, label: 'Processing' },
  shipped: { color: 'text-gold', icon: Truck, label: 'In Transit' },
  delivered: { color: 'text-green-400', icon: Check, label: 'Delivered' },
};

export default function Orders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<OrdersResponse>('/api/orders')
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-cream/40">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-32 pb-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">History</p>
        <h1 className="font-serif text-5xl text-cream">My Orders</h1>
        <p className="mt-3 text-sm text-cream/40">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={64} className="mb-6 text-cream/20" />
          <h2 className="font-serif text-3xl text-cream">No orders yet</h2>
          <Link to="/shop" className="mt-6 text-gold underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => {
            const style = statusStyles[order.status] ?? statusStyles.pending;
            const StatusIcon = style.icon;
            return (
              <motion.div
                key={order.order_number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-cream/40">Order {order.order_number}</p>
                    <p className="mt-1 text-sm text-cream/60">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon size={16} className={style.color} />
                    <span className={`text-xs uppercase tracking-widest ${style.color}`}>
                      {style.label}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div>
                        <p className="text-sm text-cream">{item.product_name}</p>
                        <p className="text-xs text-cream/40">
                          Qty: {item.quantity}
                          {item.color && ` · ${item.color}`}
                          {item.size && ` · ${item.size}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-cream/60">Total</span>
                  <span className="text-lg text-cream">${order.total.toLocaleString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}