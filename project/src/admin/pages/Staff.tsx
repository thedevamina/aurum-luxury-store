import { useEffect, useState } from 'react';
import { Plus, Trash2, Mail } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, AdminInput } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import {
  createAdminStaff,
  deleteAdminStaff,
  fetchAdminStaff,
  type AdminStaff,
} from '@/lib/products';

export default function Staff() {
  const { show } = useToastContext();
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      setStaff(await fetchAdminStaff());
    } catch {
      show('Failed to load staff', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const openAdd = () => {
    setForm({ name: '', email: '', password: '' });
    setModalOpen(true);
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      await createAdminStaff(form);
      show('Staff member added');
      setModalOpen(false);
      await loadStaff();
    } catch {
      show('Failed to create staff member', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (member: AdminStaff) => {
    if (!confirm(`Remove ${member.name}? This cannot be undone.`)) return;
    try {
      await deleteAdminStaff(member.id);
      show('Staff removed');
      await loadStaff();
    } catch {
      show('Failed to remove staff member', 'error');
    }
  };

  const columns: Column<AdminStaff>[] = [
    {
      key: 'name', label: 'Staff Member', sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-xs text-gold">
            {s.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="text-cream">{s.name}</p>
            <p className="text-xs text-cream/40">{s.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'joined', label: 'Joined', sortable: true, render: (s) => s.joined ?? '—' },
  ];

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle={isLoading ? 'Loading...' : `${staff.length} staff members`}
        action={<AdminButton onClick={openAdd}><Plus size={16} /> Add Staff</AdminButton>}
      />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={staff}
          columns={columns}
          searchKeys={['name', 'email', 'role']}
          searchPlaceholder="Search staff..."
          emptyMessage={isLoading ? 'Loading...' : 'No staff found'}
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => show('Email composed', 'info')} className="text-cream/40 hover:text-gold"><Mail size={16} /></button>
              <button onClick={() => handleDelete(item)} className="text-cream/40 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <div className="space-y-4">
          <AdminInput label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <AdminInput label="Email" type="email" placeholder="john@aurum.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <AdminInput label="Temporary Password" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleCreate} disabled={isSaving}>{isSaving ? 'Saving...' : 'Add'}</AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
