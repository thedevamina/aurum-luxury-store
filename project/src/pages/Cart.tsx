import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ShoppingBag size={64} className="mb-6 text-cream/20" />
            <h1 className="font-serif text-5xl text-cream">Your Cart is Empty</h1>
            <p className="mt-3 max-w-md text-sm text-cream/40">
              Discover our curated collection and add your favorite pieces.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 gold-gradient px-8 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Shopping Bag</p>
        <h1 className="font-serif text-5xl text-cream">Your Cart</h1>
        <p className="mt-3 text-sm text-cream/40">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="glass flex gap-4 p-4"
                >
                  <Link to={`/product/${item.product.id}`} className="aspect-[3/4] w-24 flex-shrink-0 overflow-hidden sm:w-32">
                    <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-cream/40">{item.product.brand}</p>
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-serif text-xl text-cream hover:text-gold">{item.product.name}</h3>
                          </Link>
                          <p className="mt-1 text-xs text-cream/40">
                            {item.selectedColor}{item.selectedSize && ` · ${item.selectedSize}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-cream/40 hover:text-gold"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-white/15">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-cream/60 hover:text-gold"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm text-cream">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-cream/60 hover:text-gold"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-lg text-cream">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-strong sticky top-28 p-6">
            <h2 className="mb-6 text-xs uppercase tracking-widest text-gold">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-cream/60">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <div className="flex justify-between text-lg text-cream">
                  <span>Total</span>
                  <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
            {shipping > 0 && (
              <p className="mt-4 text-xs text-cream/40">
                Add ${(500 - subtotal).toLocaleString()} more for complimentary shipping.
              </p>
            )}
            <Link
              to="/checkout"
              className="gold-gradient mt-6 flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900 transition-transform hover:scale-[1.02]"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link
              to="/shop"
              className="mt-3 block text-center text-xs uppercase tracking-widest text-cream/50 hover:text-gold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
