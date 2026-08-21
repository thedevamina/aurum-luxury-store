import { useState } from 'react';
import { Upload, Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/admin/components/ui/AdminUI';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';

const mediaItems = [
  { id: 1, name: 'chronograph-gold.jpg', url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400', size: '2.4 MB' },
  { id: 2, name: 'noir-tote.jpg', url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400', size: '1.8 MB' },
  { id: 3, name: 'diamond-ring.jpg', url: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400', size: '3.1 MB' },
  { id: 4, name: 'amber-fragrance.jpg', url: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=400', size: '1.5 MB' },
  { id: 5, name: 'aviator-sunglasses.jpg', url: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=400', size: '2.0 MB' },
  { id: 6, name: 'monaco-loafers.jpg', url: 'https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&w=400', size: '2.7 MB' },
  { id: 7, name: 'pearl-necklace.jpg', url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=400', size: '1.9 MB' },
  { id: 8, name: 'heritage-backpack.jpg', url: 'https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg?auto=compress&cs=tinysrgb&w=400', size: '2.2 MB' },
  { id: 9, name: 'editorial-banner.jpg', url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400', size: '4.5 MB' },
  { id: 10, name: 'atelier.jpg', url: 'https://images.pexels.com/photos/3750141/pexels-photo-3750141.jpeg?auto=compress&cs=tinysrgb&w=400', size: '3.8 MB' },
  { id: 11, name: 'gmt-watch.jpg', url: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=400', size: '2.1 MB' },
  { id: 12, name: 'sneakers.jpg', url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400', size: '1.7 MB' },
];

export default function MediaLibrary() {
  const { show } = useToastContext();
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${mediaItems.length} files`}
        action={
          <AdminButton onClick={() => show('Upload dialog opened', 'info')}>
            <Upload size={16} /> Upload
          </AdminButton>
        }
      />

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between glass-strong rounded-lg px-4 py-3"
        >
          <span className="text-sm text-cream">{selected.length} selected</span>
          <button
            onClick={() => { setSelected([]); show('Files deleted', 'error'); }}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} /> Delete
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {mediaItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => toggleSelect(item.id)}
            className={`group relative cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
              selected.includes(item.id) ? 'border-gold' : 'border-transparent hover:border-white/20'
            }`}
          >
            <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 bg-ink-900/60 opacity-0 transition-opacity group-hover:opacity-100" />
            {selected.includes(item.id) && (
              <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold">
                <Check size={14} className="text-ink-900" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink-900 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="truncate text-[10px] text-cream">{item.name}</p>
              <p className="text-[10px] text-cream/40">{item.size}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
