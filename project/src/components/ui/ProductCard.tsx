import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Rating from './Rating';

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wished = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="group relative"
    >
      <Link to={`/product/${product.slug ?? product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-ink-700">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {product.badge && (
            <span className="absolute left-4 top-4 glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
              {product.badge}
            </span>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-900/60">
              <span className="text-sm uppercase tracking-widest text-cream/70">Out of Stock</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            className="absolute right-4 top-4 glass flex h-9 w-9 items-center justify-center transition-colors hover:text-gold"
            aria-label="Toggle wishlist"
          >
            <Heart size={16} className={wished ? 'fill-gold text-gold' : 'text-cream'} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              disabled={!product.inStock}
              className="gold-gradient flex w-full items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest text-ink-900 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={14} />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-cream/40">{product.brand}</p>
          <h3 className="font-serif text-lg text-cream transition-colors group-hover:text-gold">{product.name}</h3>
          <Rating value={product.rating} reviews={product.reviews} />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm text-cream">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-cream/40 line-through">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
