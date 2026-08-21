import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiFetch, ApiError } from '@/lib/api';

type CheckoutResponse = {
  data: {
    order_number: string;
    total: number;
  };
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = ['Information', 'Shipping', 'Payment'];

  const handlePlaceOrder = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await apiFetch<CheckoutResponse>('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          shipping_name: `${firstName} ${lastName}`.trim(),
          shipping_address_line1: address,
          shipping_city: city,
          shipping_postal_code: postalCode,
          shipping_country: country,
          shipping_phone: phone || undefined,
        }),
      });
      setPlaced(true);
      await clearCart();
      setTimeout(() => navigate('/orders'), 2500);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-32">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gold"
        >
          <Check size={48} className="text-gold" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-5xl text-cream"
        >
          Order Confirmed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-cream/50"
        >
          Thank you. Your order has been placed successfully.
        </motion.p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-32 text-center">
        <h1 className="font-serif text-4xl text-cream">Your cart is empty</h1>
        <Link to="/shop" className="mt-6 text-gold underline">Browse collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-32 pb-20 md:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Checkout</p>
        <h1 className="font-serif text-5xl text-cream">Complete Your Order</h1>
      </div>

      <div className="mx-auto mb-12 flex max-w-md items-center justify-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                step > i + 1
                  ? 'border-gold bg-gold text-ink-900'
                  : step === i + 1
                  ? 'border-gold text-gold'
                  : 'border-white/15 text-cream/30'
              }`}
            >
              {step > i + 1 ? <Check size={14} /> : i + 1}
            </div>
            <span className={`hidden text-xs uppercase tracking-widest sm:block ${
              step >= i + 1 ? 'text-cream' : 'text-cream/30'
            }`}>{label}</span>
            {i < steps.length - 1 && <div className={`h-px w-8 ${step > i + 1 ? 'bg-gold' : 'bg-white/15'}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-6 md:p-8"
          >
            {error && (
              <div className="mb-6 rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-cream">Contact Information</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">First Name</label>
                    <input className="input-luxury" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">Last Name</label>
                    <input className="input-luxury" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-cream/50">Phone</label>
                  <input className="input-luxury" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="gold-gradient w-full py-4 text-xs font-semibold uppercase tracking-widest text-ink-900"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-cream">Shipping Address</h2>
                <div>
                  <label className="text-xs uppercase tracking-widest text-cream/50">Address</label>
                  <input className="input-luxury" placeholder="123 Luxury Lane" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">City</label>
                    <input className="input-luxury" placeholder="New York" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">ZIP Code</label>
                    <input className="input-luxury" placeholder="10001" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-cream/50">Country</label>
                  <input className="input-luxury" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-white/15 px-6 py-4 text-xs uppercase tracking-widest text-cream/60 hover:border-gold hover:text-gold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="gold-gradient flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl text-cream">Payment Details</h2>
                <p className="text-xs text-cream/30">
                  Payment processing isn't connected yet — placing this order will not charge a card,
                  but will create a real order in an unpaid state.
                </p>
                <div>
                  <label className="text-xs uppercase tracking-widest text-cream/50">Card Number</label>
                  <div className="relative">
                    <input className="input-luxury pr-10" placeholder="0000 0000 0000 0000" disabled />
                    <CreditCard size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-cream/30" />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">Expiry Date</label>
                    <input className="input-luxury" placeholder="MM / YY" disabled />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-cream/50">CVC</label>
                    <input className="input-luxury" placeholder="123" disabled />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-cream/40">
                  <Lock size={14} className="text-gold" />
                  Your payment information is encrypted and secure.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="border border-white/15 px-6 py-4 text-xs uppercase tracking-widest text-cream/60 hover:border-gold hover:text-gold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="gold-gradient flex-1 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order — $${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-strong sticky top-28 p-6">
            <h2 className="mb-6 text-xs uppercase tracking-widest text-gold">Order Summary</h2>
            <div className="mb-6 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative aspect-[3/4] w-14 flex-shrink-0 overflow-hidden">
                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-gold text-[10px] font-bold text-ink-900">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-cream">{item.product.name}</p>
                    <p className="text-xs text-cream/40">{item.selectedColor}</p>
                  </div>
                  <p className="text-xs text-cream">${(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-cream/60">
                <span>Subtotal</span><span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between text-cream/60">
                <span>Tax</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-lg text-cream">
                <span>Total</span>
                <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}