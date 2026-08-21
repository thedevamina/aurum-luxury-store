import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge, AdminInput, AdminSelect, AdminTextarea } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  fetchAdminCategoryOptions,
  type AdminProduct,
  type AdminCategoryOption,
} from '@/lib/products';
import type { Category } from '@/data/products';

export default function Products() {
  const { show } = useToastContext();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', category_id: '', price: '', stock_quantity: '', description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch {
      show('Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

useEffect(() => {
  loadProducts();
  fetchAdminCategoryOptions().then(setCategories).catch(() => setCategories([]));
}, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category_id: '', price: '', stock_quantity: '', description: '' });
    setImageFile(null);
    setModalOpen(true);
  };

  const openEdit = (p: AdminProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      category_id: String(p.category.id),
      price: String(p.price),
      stock_quantity: String(p.stock_quantity),
      description: p.description ?? '',
    });
    setImageFile(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category_id', form.category_id);
      fd.append('price', form.price);
      fd.append('stock_quantity', form.stock_quantity);
      fd.append('description', form.description);
      if (imageFile) fd.append('images[]', imageFile);

      if (editing) {
        await updateAdminProduct(editing.id, fd);
        show('Product updated');
      } else {
        await createAdminProduct(fd);
        show('Product created');
      }
      setModalOpen(false);
      await loadProducts();
    } catch {
      show(editing ? 'Failed to update product' : 'Failed to create product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (p: AdminProduct) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteAdminProduct(p.id);
      show('Product deleted');
      await loadProducts();
    } catch {
      show('Failed to delete product', 'error');
    }
  };

  const columns: Column<AdminProduct>[] = [
    {
      key: 'name', label: 'Product', sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images?.[0] ?? ''} alt="" className="h-10 w-10 rounded object-cover bg-white/5" />
          <div>
            <p className="text-cream">{p.name}</p>
            <p className="text-xs text-cream/40">{p.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', label: 'Category', sortable: false, render: (p) => p.category.name },
    { key: 'price', label: 'Price', sortable: true, render: (p) => `$${Number(p.price).toLocaleString()}` },
    {
      key: 'stock_quantity', label: 'Stock', sortable: true,
      render: (p) => <span className={p.stock_quantity === 0 ? 'text-red-400' : ''}>{p.stock_quantity}</span>,
    },
    {
      key: 'is_published', label: 'Status',
      render: (p) => <StatusBadge status={p.is_published ? 'Published' : 'Draft'} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={isLoading ? 'Loading...' : `${products.length} products in catalog`}
        action={<AdminButton onClick={openAdd}><Plus size={16} /> Add Product</AdminButton>}
      />
      <div className="glass rounded-lg p-6">
        <DataTable
          data={products}
          columns={columns}
          searchKeys={['name', 'slug']}
          searchPlaceholder="Search products..."
          emptyMessage={isLoading ? 'Loading...' : 'No products found'}
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => openEdit(item)} className="text-cream/40 hover:text-gold"><Edit size={16} /></button>
              <button onClick={() => handleDelete(item)} className="text-cream/40 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="space-y-4">
          <AdminInput
            label="Product Name"
            placeholder="e.g. Aurum Chronograph"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <AdminSelect
  label="Category"
  options={categories.map((c) => c.name)}
  value={categories.find((c) => String(c.id) === form.category_id)?.name ?? ''}
  onChange={(e) => {
    const cat = categories.find((c) => c.name === e.target.value);
    setForm({ ...form, category_id: cat ? String(cat.id) : '' });
  }}
/>
            <AdminInput
              label="Price"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <AdminInput
            label="Stock"
            type="number"
            placeholder="0"
            value={form.stock_quantity}
            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
          />
          <AdminTextarea
            label="Description"
            rows={4}
            placeholder="Product description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">Product Image</label>
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
              {isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Create Product'}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}