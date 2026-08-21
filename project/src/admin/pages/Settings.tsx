import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, CreditCard, Mail, Bell, Shield } from 'lucide-react';
import { PageHeader } from '@/admin/components/ui/AdminUI';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Settings() {
  const { show } = useToastContext();
  const [activeTab, setActiveTab] = useState('general');

  const fieldClass = 'w-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none rounded-md transition-colors';
  const labelClass = 'mb-1.5 block text-xs uppercase tracking-widest text-cream/50';

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your store" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="glass rounded-lg p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all ${
                  activeTab === tab.id ? 'bg-gold/10 text-gold' : 'text-cream/50 hover:bg-white/[0.03] hover:text-cream'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-lg p-6"
          >
            {activeTab === 'general' && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-cream">Store Information</h3>
                <div>
                  <label className={labelClass}>Store Name</label>
                  <input className={fieldClass} defaultValue="Aurum" />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input className={fieldClass} defaultValue="The Art of Luxury Living" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Currency</label>
                    <select className={fieldClass + ' bg-ink-800'}>
                      <option>USD ($)</option><option>EUR (€)</option><option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Timezone</label>
                    <select className={fieldClass + ' bg-ink-800'}>
                      <option>UTC-5 (New York)</option><option>UTC+0 (London)</option><option>UTC+1 (Paris)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-cream">Payment Settings</h3>
                {['Stripe', 'PayPal', 'Apple Pay'].map((p) => (
                  <div key={p} className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-sm text-cream">{p}</span>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked={p !== 'Apple Pay'} className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-gold transition-colors" />
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream transition-transform peer-checked:translate-x-5" />
                    </label>
                  </div>
                ))}
                <div>
                  <label className={labelClass}>Stripe Secret Key</label>
                  <input type="password" className={fieldClass} placeholder="sk_live_..." />
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-cream">Email Configuration</h3>
                <div>
                  <label className={labelClass}>SMTP Host</label>
                  <input className={fieldClass} placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelClass}>Port</label><input className={fieldClass} placeholder="587" /></div>
                  <div><label className={labelClass}>Encryption</label><select className={fieldClass + ' bg-ink-800'}><option>TLS</option><option>SSL</option></select></div>
                </div>
                <div><label className={labelClass}>From Email</label><input className={fieldClass} defaultValue="noreply@aurum.com" /></div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-cream">Notification Preferences</h3>
                {['New orders', 'Low stock alerts', 'New reviews', 'New customer registrations', 'Contact messages'].map((n) => (
                  <div key={n} className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-sm text-cream">{n}</span>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-gold transition-colors" />
                      <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream transition-transform peer-checked:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <h3 className="font-serif text-xl text-cream">Security Settings</h3>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <p className="text-sm text-cream">Two-Factor Authentication</p>
                    <p className="text-xs text-cream/40">Require 2FA for all admin accounts</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="h-6 w-11 rounded-full bg-white/10 peer-checked:bg-gold transition-colors" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cream transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>
                <div>
                  <label className={labelClass}>Session Timeout (minutes)</label>
                  <input type="number" className={fieldClass} defaultValue={30} />
                </div>
                <div>
                  <label className={labelClass}>Max Login Attempts</label>
                  <input type="number" className={fieldClass} defaultValue={5} />
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <AdminButton onClick={() => show('Settings saved')}><Save size={16} /> Save Changes</AdminButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
