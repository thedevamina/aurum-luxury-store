import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Check } from 'lucide-react';
import type { Product } from '@/data/products';
import { fetchProductBySlugOrId, fetchProducts } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import Rating from '@/components/ui/Rating';
import { LineSkeleton } from '@/components/ui/Skeleton';
import Toast from '@/components/ui/Toast';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    window.scrollTo(0, 0);

    fetchProductBySlugOrId(id)
      .then((p) => {
        setProduct(p);
        setColor(p?.colors[0] ?? '');
        setSize(p?.sizes[0] ?? '');
        if (p) {
          return fetchProducts({ category: p.category }).then((res) => {
            setRelated(res.products.filter((rp) => rp.id !== p.id).slice(0, 4));
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="font-serif text-4xl text-cream">Product not found</h1>
        <Link to="/shop" className="text-gold underline">Return to shop</Link>
      </div>
    );
  }

  const wished = product ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, color, size);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="pt-28">
      {product && <Toast message={`${product.name} added to cart`} show={toast} />}

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <nav className="flex items-center gap-2 text-xs text-cream/40">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-gold">Shop</Link>
          <ChevronRight size={12} />
          <span className="text-cream/60">{product?.name}</span>
        </nav>
      </div>

      {loading || !product ? (
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-8 md:grid-cols-2 md:px-8">
          <LineSkeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4">
            <LineSkeleton className="h-4 w-1/3" />
            <LineSkeleton className="h-10 w-3/4" />
            <LineSkeleton className="h-6 w-1/4" />
            <LineSkeleton className="h-24 w-full" />
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-8 md:grid-cols-2 md:px-8">
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[3/4] overflow-hidden bg-ink-700"
            >
              <img src={product.images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
              {product.badge && (
                <span className="absolute left-4 top-4 glass px-3 py-1 text-[10px] uppercase tracking-widest text-gold">
                  {product.badge}
                </span>
              )}
            </motion.div>
            <div className="mt-4 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square w-20 overflow-hidden border transition-colors ${
                    activeImage === i ? 'border-gold' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-[11px] uppercase tracking-widest text-gold">{product.brand}</p>
              <h1 className="mt-2 font-serif text-4xl text-cream md:text-5xl">{product.name}</h1>
              <div className="mt-4">
                <Rating value={product.rating} reviews={product.reviews} size={16} />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <span className="text-3xl text-cream">${product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-lg text-cream/40 line-through">${product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-cream/60">{product.description}</p>

              {product.colors.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Color: <span className="text-gold">{color}</span></p>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                          color === c ? 'bg-gold text-ink-900' : 'border border-white/15 text-cream/60 hover:border-gold'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Size: <span className="text-gold">{size}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`min-w-[3rem] px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
                          size === s ? 'bg-gold text-ink-900' : 'border border-white/15 text-cream/60 hover:border-gold'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-widest text-cream/50">Quantity</p>
                <div className="inline-flex items-center border border-white/15">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 text-cream/60 hover:text-gold">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-sm text-cream">{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-3 text-cream/60 hover:text-gold">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="gold-gradient flex flex-1 items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag size={16} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={() => toggle(product)}
                  className="flex h-[52px] w-[52px] items-center justify-center border border-white/15 transition-colors hover:border-gold"
                >
                  <Heart size={20} className={wished ? 'fill-gold text-gold' : 'text-cream'} />
                </button>
              </div>

              {product.inStock && (
                <p className="mt-4 flex items-center gap-2 text-xs text-gold">
                  <Check size={14} /> In stock — ships within 24 hours
                </p>
              )}

              <div className="mt-10 border-t border-white/10 pt-8">
                <h3 className="mb-4 text-xs uppercase tracking-widest text-gold">Product Details</h3>
                <ul className="space-y-2">
                  {product.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-cream/60">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gold" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <h2 className="mb-8 text-center font-serif text-4xl text-cream">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}