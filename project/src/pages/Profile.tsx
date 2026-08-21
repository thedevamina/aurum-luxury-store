import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, MapPin, CreditCard } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';

const menuItems = [
  { icon: Package, label: 'My Orders', to: '/orders' },
  { icon: Heart, label: 'Wishlist', to: '/wishlist' },
  { icon: MapPin, label: 'Addresses', to: '/profile' },
  { icon: CreditCard, label: 'Payment Methods', to: '/profile' },
  { icon: Settings, label: 'Account Settings', to: '/profile' },
];

type OrdersResponse = {
  data: unknown[];
  meta?: { total: number };
};

export default function Profile() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { count: wishCount } = useWishlist();
  const { totalItems } = useCart();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    apiFetch<OrdersResponse>('/api/orders')
      .then((res) => setOrderCount(res.meta?.total ?? res.data.length))
      .catch(() => setOrderCount(0));
  }, [user]);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-cream/40">Loading...</p>
      </div>
    );
  }

  const memberSince = new Date(user.created_at).getFullYear();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold">
              <User size={40} className="text-gold" />
            </div>
            <h1 className="font-serif text-3xl text-cream">{user.name}</h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">Member since {memberSince}</p>
            <div className="mt-6 flex justify-center gap-8">
              <div>
                <p className="font-serif text-2xl text-gold">{totalItems}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">In Cart</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-gold">{wishCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">Wishlist</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-gold">{orderCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-cream/40">Orders</p>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 glass p-4">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 border-b border-white/5 py-3 text-sm text-cream/60 last:border-0 hover:text-gold"
              >
                <item.icon size={18} className="text-gold" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 py-3 text-sm text-cream/60 hover:text-gold"
            >
              <LogOut size={18} className="text-gold" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-strong p-8"
          >
            <h2 className="mb-6 font-serif text-2xl text-cream">Account Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/50">Full Name</label>
                <input className="input-luxury" defaultValue={user.name} readOnly />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/50">Email</label>
                <input type="email" className="input-luxury" defaultValue={user.email} readOnly />
              </div>
            </div>

            <p className="mt-6 text-xs text-cream/30">
              Phone, date of birth, and shipping address aren't stored on your account yet —
              those fields will be added in a future update.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}