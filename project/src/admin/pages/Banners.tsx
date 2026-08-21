import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge, AdminInput, AdminTextarea, AdminSelect } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import { ApiError } from '@/lib/api';
import {
  fetchAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  type AdminBanner,
} from '@/lib/products';

export default function Banners() {
  const { show } = useToastContext();
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBanner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link_url: '',
    sort_order: '',
    is_active: 'Active',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      setBanners(await fetchAdminBanners());
    } catch {
      show('Failed to load banners', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: '',
      subtitle: '',
      link_url: '',
      sort_order: '',
      is_active: 'Active',
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (banner: AdminBanner) => {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      link_url: banner.link_url ?? '',
      sort_order: String(banner.sort_order),
      is_active: banner.is_active ? 'Active' : 'Inactive',
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('subtitle', form.subtitle);
      fd.append('link_url', form.link_url);
      fd.append('sort_order', form.sort_order);
      fd.append('is_active', form.is_active === 'Active' ? '1' : '0');
      if (imageFile) {
        fd.append('image', imageFile);
      }

      if (editing) {
        await updateAdminBanner(editing.id, fd);
        show('Banner updated');
      } else {
        await createAdminBanner(fd);
        show('Banner created');
      }

      setModalOpen(false);
      await loadBanners();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to save banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (banner: AdminBanner) => {
    if (!confirm(`Delete banner "${banner.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteAdminBanner(banner.id);
      show('Banner deleted');
      await loadBanners();
    } catch (err) {
      show(err instanceof ApiError ? err.message : 'Failed to delete banner', 'error');
    }
  };

  const columns: Column<AdminBanner>[] = [
    {
      key: 'title',
      label: 'Banner',
      sortable: true,
      render: (banner) => (
        <div className="flex items-center gap-3">
          <img src={banner.image} alt={banner.title} className="h-10 w-10 rounded object-cover bg-white/5" />
          <div>
            <p className="text-cream">{banner.title}</p>
            <p className="text-xs text-cream/40">{banner.subtitle ?? 'No subtitle'}</p>
          </div>
        </div>
      ),
    },
    { key: 'link_url', label: 'Link', render: (banner) => banner.link_url ?? '—' },
    { key: 'sort_order', label: 'Sort Order', sortable: true },
    {
      key: 'is_active',
      label: 'Status',
      render: (banner) => <StatusBadge status={banner.is_active ? 'Active' : 'Inactive'} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle={isLoading ? 'Loading...' : `${banners.length} promotional banners`}
        action={<AdminButton onClick={openAdd}><Plus size={16} /> Add Banner</AdminButton>}
      />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={banners}
          columns={columns}
          searchKeys={['title', 'subtitle', 'link_url']}
          searchPlaceholder="Search banners..."
          emptyMessage={isLoading ? 'Loading...' : 'No banners found'}
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => openEdit(item)} className="text-cream/40 hover:text-gold"><Edit size={16} /></button>
              <button onClick={() => handleDelete(item)} className="text-cream/40 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Banner' : 'Add Banner'}>
        <div className="space-y-4">
          <AdminInput
            label="Title"
            placeholder="Summer Collection"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <AdminTextarea
            label="Subtitle"
            rows={3}
            placeholder="Promotional message..."
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminInput
              label="Link URL"
              placeholder="https://..."
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            />
            <AdminInput
              label="Sort Order"
              type="number"
              placeholder="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />
          </div>
          <AdminSelect
            label="Status"
            options={['Active', 'Inactive']}
            value={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">Banner Image</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-cream/60 file:mr-4 file:rounded-md file:border-0 file:bg-gold/10 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-gold"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <AdminButton variant="outline" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Create Banner'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
