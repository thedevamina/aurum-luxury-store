import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader, StatusBadge, AdminInput, AdminSelect } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import { useState } from 'react';

const shippingMethods = [
  { id: 1, name: 'Standard Shipping', carrier: 'FedEx', rate: 15, eta: '5-7 days', status: 'Active' },
  { id: 2, name: 'Express Shipping', carrier: 'DHL', rate: 35, eta: '2-3 days', status: 'Active' },
  { id: 3, name: 'Overnight', carrier: 'UPS', rate: 75, eta: '1 day', status: 'Active' },
  { id: 4, name: 'International', carrier: 'DHL', rate: 50, eta: '7-14 days', status: 'Active' },
  { id: 5, name: 'Free Shipping', carrier: 'FedEx', rate: 0, eta: '5-7 days', status: 'Inactive' },
];

const shippingZones = [
  { zone: 'North America', countries: 3, rate: '$15', status: 'Active' },
  { zone: 'Europe', countries: 28, rate: '$35', status: 'Active' },
  { zone: 'Asia Pacific', countries: 15, rate: '$50', status: 'Active' },
  { zone: 'Middle East', countries: 8, rate: '$45', status: 'Active' },
  { zone: 'South America', countries: 12, rate: '$55', status: 'Inactive' },
];

export default function Shipping() {
  const { show } = useToastContext();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Shipping"
        subtitle="Manage shipping methods and zones"
        action={<AdminButton onClick={() => setModalOpen(true)}><Plus size={16} /> Add Method</AdminButton>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Shipping Methods</h3>
          <div className="space-y-3">
            {shippingMethods.map((m) => (
              <div key={m.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-gold" />
                  <div>
                    <p className="text-sm text-cream">{m.name}</p>
                    <p className="text-xs text-cream/40">{m.carrier} · {m.eta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-cream">{m.rate === 0 ? 'Free' : `$${m.rate}`}</span>
                  <StatusBadge status={m.status} />
                  <button onClick={() => setModalOpen(true)} className="text-cream/40 hover:text-gold"><Edit size={14} /></button>
                  <button onClick={() => show('Method deleted', 'error')} className="text-cream/40 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6"
        >
          <h3 className="mb-6 font-serif text-xl text-cream">Shipping Zones</h3>
          <div className="space-y-3">
            {shippingZones.map((z, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div>
                  <p className="text-sm text-cream">{z.zone}</p>
                  <p className="text-xs text-cream/40">{z.countries} countries</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-cream">{z.rate}</span>
                  <StatusBadge status={z.status} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Shipping Method">
        <div className="space-y-4">
          <AdminInput label="Method Name" placeholder="Express Shipping" />
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect label="Carrier" options={['FedEx', 'DHL', 'UPS', 'USPS']} />
            <AdminInput label="Rate ($)" type="number" placeholder="35" />
          </div>
          <AdminInput label="Estimated Delivery" placeholder="2-3 days" />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={() => { setModalOpen(false); show('Method created'); }}>Create</AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
