import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import type { Product, Category } from '@/data/products';
import { fetchProducts, fetchCategories } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { GridSkeleton } from '@/components/ui/Skeleton';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('featured');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sort: sort === 'featured' ? undefined : sort,
    })
      .then((res) => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, sort]);

  const setCategory = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Collection</p>
        <h1 className="font-serif text-5xl text-cream md:text-6xl">
          {selectedCategory === 'all'
            ? 'All Products'
            : categories.find((c) => c.id === selectedCategory)?.name || 'Shop'}
        </h1>
        <p className="mt-3 text-sm text-cream/40">{products.length} pieces available</p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream/60 hover:text-gold md:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        <div className="hidden flex-wrap items-center gap-2 md:flex">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              selectedCategory === 'all' ? 'bg-gold text-ink-900' : 'text-cream/50 hover:text-cream'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                selectedCategory === cat.id ? 'bg-gold text-ink-900' : 'text-cream/50 hover:text-cream'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="glass px-4 py-2 text-xs uppercase tracking-widest text-cream focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-ink-800">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <GridSkeleton count={8} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      )}

      {showFilters && (
        <>
          <div className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm md:hidden" onClick={() => setShowFilters(false)} />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed left-0 top-0 z-50 h-full w-72 glass-strong p-6 md:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-2xl text-cream">Filters</span>
              <button onClick={() => setShowFilters(false)}><X size={22} className="text-cream/60" /></button>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => { setCategory('all'); setShowFilters(false); }}
                className={`block w-full py-2 text-left text-sm uppercase tracking-widest ${
                  selectedCategory === 'all' ? 'text-gold' : 'text-cream/50'
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setCategory(cat.id); setShowFilters(false); }}
                  className={`block w-full py-2 text-left text-sm uppercase tracking-widest ${
                    selectedCategory === cat.id ? 'text-gold' : 'text-cream/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}