import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Boxes,
  Ticket, Star, Image, FolderOpen, BarChart3, Truck, CreditCard,
  Shield, UserCog, Settings, User, Activity, Bell, Mail, X, ChevronDown,
} from 'lucide-react';

import { LogOut } from 'lucide-react';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';
const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    ],
  },

  {
    label: 'Catalog',
    items: [
      { label: 'Products', to: '/products', icon: Package },
      { label: 'Categories', to: '/categories', icon: FolderTree },
      { label: 'Inventory', to: '/inventory', icon: Boxes },
      { label: 'Coupons', to: '/coupons', icon: Ticket },
      { label: 'Reviews', to: '/reviews', icon: Star },
      { label: 'Banners', to: '/banners', icon: Image },
      { label: 'Media Library', to: '/media', icon: FolderOpen },
    ],
  },
  {
    label: 'Sales',
    items: [
      { label: 'Orders', to: '/orders', icon: ShoppingCart },
      { label: 'Customers', to: '/customers', icon: Users },
      { label: 'Reports', to: '/reports', icon: BarChart3 },
      { label: 'Shipping', to: '/shipping', icon: Truck },
      { label: 'Payments', to: '/payments', icon: CreditCard },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Roles & Permissions', to: '/roles', icon: Shield },
      { label: 'Staff', to: '/staff', icon: UserCog },
      { label: 'Activity Logs', to: '/activity-logs', icon: Activity },
      { label: 'Notifications', to: '/notifications', icon: Bell },
      { label: 'Contact Messages', to: '/contact-messages', icon: Mail },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', to: '/settings', icon: Settings },
      { label: 'Profile', to: '/profile', icon: User },
    ],
  },
];

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const location = useLocation();
const { admin, logout } = useAdminAuth();

const handleLogout = async () => {
  await logout();
};
  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link to="/" className="font-serif text-2xl text-cream">
          AURUM<span className="text-gold text-sm align-top ml-1">Admin</span>
        </Link>
        <button onClick={onClose} className="text-cream/40 hover:text-gold lg:hidden">
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-6 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.2em] text-cream/30">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                      active
                        ? 'bg-gold/10 text-gold border-l-2 border-gold'
                        : 'text-cream/50 hover:bg-white/[0.03] hover:text-cream'
                    }`}
                  >
                    <item.icon size={18} className={active ? 'text-gold' : 'text-cream/40 group-hover:text-gold'} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User card */}
      {/* User card */}
      <div className="border-t border-white/10 p-4">
        <Link to="/profile" className="flex items-center gap-3 rounded-md p-2 hover:bg-white/[0.03] transition-colors">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <User size={16} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm text-cream">{admin?.name ?? 'Admin User'}</p>
            <p className="truncate text-xs text-cream/40">{admin?.email ?? ''}</p>
          </div>
          <ChevronDown size={16} className="text-cream/30" />
        </Link>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-md p-2 text-sm text-cream/50 hover:bg-white/[0.03] hover:text-gold transition-colors"
        >
          <LogOut size={16} className="text-cream/40" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 border-r border-white/10 bg-ink-800/50 backdrop-blur-xl lg:block">
        {content}
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-72 glass-strong lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
