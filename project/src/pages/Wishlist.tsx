import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui/ProductCard';

export default function Wishlist() {
  const { items } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Saved</p>
        <h1 className="font-serif text-5xl text-cream md:text-6xl">Your Wishlist</h1>
        <p className="mt-3 text-sm text-cream/40">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Heart size={64} className="mb-6 text-cream/20" />
          <h2 className="font-serif text-3xl text-cream">No saved items yet</h2>
          <p className="mt-2 max-w-md text-sm text-cream/40">
            Tap the heart icon on any product to save it here for later.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 gold-gradient px-8 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900"
          >
            Explore Collection <ArrowRight size={16} />
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => items.forEach((p) => addToCart(p))}
              className="text-xs uppercase tracking-widest text-gold hover:text-gold-light"
            >
              Add all to cart
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
