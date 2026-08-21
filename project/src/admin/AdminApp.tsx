import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminAuthProvider, useAdminAuth } from '@/admin/context/AdminAuthContext';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import AdminLogin from '@/admin/pages/AdminLogin';
import Dashboard from '@/admin/pages/Dashboard';
import Products from '@/admin/pages/Products';
import Categories from '@/admin/pages/Categories';
import Orders from '@/admin/pages/Orders';
import Customers from '@/admin/pages/Customers';
import Inventory from '@/admin/pages/Inventory';
import Coupons from '@/admin/pages/Coupons';
import Reviews from '@/admin/pages/Reviews';
import Banners from '@/admin/pages/Banners';
import MediaLibrary from '@/admin/pages/MediaLibrary';
import Reports from '@/admin/pages/Reports';
import Shipping from '@/admin/pages/Shipping';
import Payments from '@/admin/pages/Payments';
import Roles from '@/admin/pages/Roles';
import Staff from '@/admin/pages/Staff';
import Settings from '@/admin/pages/Settings';
import AdminProfile from '@/admin/pages/AdminProfile';
import ActivityLogs from '@/admin/pages/ActivityLogs';
import Notifications from '@/admin/pages/Notifications';
import ContactMessages from '@/admin/pages/ContactMessages';

function ProtectedAdminArea() {
  const { admin, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900">
        <p className="text-cream/40">Loading...</p>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/media" element={<MediaLibrary />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/contact-messages" element={<ContactMessages />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <HashRouter>
        <ProtectedAdminArea />
      </HashRouter>
    </AdminAuthProvider>
  );
}