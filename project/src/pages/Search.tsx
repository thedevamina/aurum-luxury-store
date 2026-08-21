import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { GridSkeleton } from '@/components/ui/Skeleton';
import { searchProductsApi } from '@/lib/products';
import type { Product } from '@/data/products';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    setInput(query);
    let isActive = true;

    const loadResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchProductsApi(query);
        if (isActive) {
          setResults(data);
        }
      } catch {
        if (isActive) {
          setResults([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      isActive = false;
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Search</p>
        <h1 className="font-serif text-5xl text-cream">Find Your Piece</h1>

        <form onSubmit={handleSubmit} className="mt-8 flex items-center gap-3 border-b border-white/15 pb-3">
          <SearchIcon size={22} className="text-gold" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search watches, bags, jewelry..."
            className="flex-1 bg-transparent text-lg text-cream placeholder-cream/30 focus:outline-none"
          />
          {input && (
            <button type="button" onClick={() => setInput('')}>
              <X size={20} className="text-cream/40 hover:text-cream" />
            </button>
          )}
        </form>
      </div>

      <div className="mt-12">
        {query && (
          <p className="mb-8 text-center text-sm text-cream/50">
            {loading ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}

        {!query && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon size={48} className="mb-4 text-cream/20" />
            <p className="text-cream/40">Start typing to search our collection</p>
          </div>
        )}

        {query && !loading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-2xl text-cream">No results found</p>
            <p className="mt-2 text-sm text-cream/40">Try a different search term</p>
          </div>
        )}

        {loading ? (
          <GridSkeleton count={8} />
        ) : (
          results.length > 0 && (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
