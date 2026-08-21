import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';
import { PageHeader, StatCard } from '@/admin/components/ui/AdminUI';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';

export default function AdminProfile() {
  const { show } = useToastContext();
  const fieldClass = 'w-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none rounded-md transition-colors';
  const labelClass = 'mb-1.5 block text-xs uppercase tracking-widest text-cream/50';

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your account" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-6 text-center"
        >
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold bg-gold/10">
            <span className="font-serif text-3xl text-gold">AU</span>
          </div>
          <h2 className="font-serif text-2xl text-cream">Admin User</h2>
          <p className="text-sm text-cream/40">Super Admin</p>
          <p className="mt-1 text-xs text-cream/30">admin@aurum.com</p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <div className="glass rounded-lg p-3">
              <p className="font-serif text-xl text-gold">248</p>
              <p className="text-[10px] uppercase tracking-widest text-cream/40">Actions</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="font-serif text-xl text-gold">12</p>
              <p className="text-[10px] uppercase tracking-widest text-cream/40">Modules</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="font-serif text-xl text-gold">2y</p>
              <p className="text-[10px] uppercase tracking-widest text-cream/40">Member</p>
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6 lg:col-span-2"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input className={fieldClass} defaultValue="Admin" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input className={fieldClass} defaultValue="User" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={fieldClass} defaultValue="admin@aurum.com" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={fieldClass} defaultValue="+1 (555) 000-0000" />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input className={fieldClass} defaultValue="New York, USA" />
            </div>
            <div>
              <label className={labelClass}>Joined</label>
              <input className={fieldClass} defaultValue="Jan 2024" disabled />
            </div>
          </div>

          <h3 className="mb-4 mt-6 font-serif text-xl text-cream">Change Password</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Current Password</label>
              <input type="password" className={fieldClass} placeholder="••••••••" />
            </div>
            <div>
              <label className={labelClass}>New Password</label>
              <input type="password" className={fieldClass} placeholder="••••••••" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <AdminButton onClick={() => show('Profile updated')}><Edit size={16} /> Save Changes</AdminButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
