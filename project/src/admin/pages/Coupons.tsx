import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge, AdminInput, AdminSelect } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import {
  fetchAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
  type AdminCoupon,
} from '@/lib/products';
import { ApiError } from '@/lib/api';

export default function Coupons() {
  const { show } = useToastContext();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    code: '', type: 'Percentage', value: '', usage_limit: '', expires_at: '',
  });

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      setCoupons(await fetchAdminCoupons());
    } catch {
      show('Failed to load coupons', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ code: '', type: 'Percentage', value: '', usage_limit: '', expires_at: '' });
    setModalOpen(true);
  };

  const openEdit = (c: AdminCoupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type === 'percentage' ? 'Percentage' : 'Fixed',
      value: String(c.value),
      usage_limit: c.usage_limit ? String(c.usage_limit) : '',
      expires_at: c.expires_at ? c.expires_at.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        code: form.code,
        type: form.type === 'Percentage' ? 'percentage' : 'fixed',
        value: Number(form.value),
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        expires_at: form.expires_at || null,
      };

      if (editing) {
        await updateAdminCoupon(editing.id, payload);
        show('Coupon updated');
      } else {
        await createAdminCoupon(payload);
        show('Coupon created');
      }
      setModalOpen(false);
      await loadCoupons();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to save coupon', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: AdminCoupon) => {
    if (!confirm(`Delete coupon "${c.code}"?`)) return;
    try {
      await deleteAdminCoupon(c.id);
      show('Coupon deleted');
      await loadCoupons();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to delete coupon', 'error');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    show('Code copied to clipboard');
  };

  const columns: Column<AdminCoupon>[] = [
    { key: 'code', label: 'Code', sortable: true, render: (c) => <span className="font-mono text-gold">{c.code}</span> },
    { key: 'type', label: 'Type', render: (c) => (c.type === 'percentage' ? 'Percentage' : 'Fixed') },
    {
      key: 'value', label: 'Value', sortable: true,
      render: (c) => (c.type === 'percentage' ? `${c.value}%` : `$${c.value}`),
    },
    {
      key: 'used_count', label: 'Used', sortable: true,
      render: (c) => `${c.used_count}/${c.usage_limit ?? '∞'}`,
    },
    {
      key: 'expires_at', label: 'Expires', sortable: true,
      render: (c) => (c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'),
    },
    {
      key: 'is_active', label: 'Status',
      render: (c) => <StatusBadge status={c.is_active ? 'Active' : 'Inactive'} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle={isLoading ? 'Loading...' : `${coupons.length} discount codes`}
        action={<AdminButton onClick={openAdd}><Plus size={16} /> Add Coupon</AdminButton>}
      />
      <div className="glass rounded-lg p-6">
        <DataTable
          data={coupons}
          columns={columns}
          searchKeys={['code']}
          searchPlaceholder="Search coupons..."
          emptyMessage={isLoading ? 'Loading...' : 'No coupons found'}
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => copyCode(item.code)} className="text-cream/40 hover:text-gold"><Copy size={16} /></button>
              <button onClick={() => openEdit(item)} className="text-cream/40 hover:text-gold"><Edit size={16} /></button>
              <button onClick={() => handleDelete(item)} className="text-cream/40 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Coupon' : 'Add Coupon'}>
        <div className="space-y-4">
          <AdminInput
            label="Coupon Code"
            placeholder="WELCOME10"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
              label="Type"
              options={['Percentage', 'Fixed']}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <AdminInput
              label="Value"
              type="number"
              placeholder="10"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Usage Limit"
              type="number"
              placeholder="100"
              value={form.usage_limit}
              onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
            />
            <AdminInput
              label="Expires"
              type="date"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}