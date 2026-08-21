import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '@/data/products';
import { mapProduct, type ApiProduct } from '@/lib/products';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type WishlistContextType = {
  items: Product[];
  toggle: (product: Product) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  count: number;
  isLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiFetch<{ data: ApiProduct[] }>('/api/wishlist');
      setItems(res.data.map(mapProduct));
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const isWishlisted = (productId: number) => items.some((p) => p.id === productId);

  const toggle = async (product: Product) => {
    if (!user) return;

    if (isWishlisted(product.id)) {
      await apiFetch(`/api/wishlist/${product.id}`, { method: 'DELETE' });
    } else {
      await apiFetch('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product_id: product.id }),
      });
    }
    await refreshWishlist();
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}