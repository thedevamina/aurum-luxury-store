import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const footerLinks = {
  Shop: [
    { label: 'All Products', to: '/shop' },
    { label: 'Watches', to: '/categories' },
    { label: 'Bags', to: '/categories' },
    { label: 'Jewelry', to: '/categories' },
  ],
  Account: [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Sign In', to: '/login' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'FAQ', to: '/contact' },
    { label: 'Shipping', to: '/about' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-ink-800">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">Newsletter</p>
            <h2 className="font-serif text-3xl text-cream md:text-4xl">Join the Maison</h2>
            <p className="mt-3 text-sm text-cream/50">
              Subscribe for exclusive previews, private collections, and early access.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) {
                  setSubscribed(true);
                  setEmail('');
                  setTimeout(() => setSubscribed(false), 3000);
                }
              }}
              className="mt-6 flex items-center gap-2 border-b border-white/15 pb-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent py-2 text-sm text-cream placeholder-cream/30 focus:outline-none"
              />
              <button type="submit" className="text-gold transition-transform hover:scale-110">
                <ArrowRight size={20} />
              </button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-xs text-gold"
              >
                Welcome to the Maison. Check your inbox.
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="font-serif text-3xl text-cream">AURUM</Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/40">
              Curated luxury for the modern connoisseur. Crafted with intention, designed for eternity.
            </p>
            <div className="mt-6 flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center border border-white/10 text-cream/50 transition-all hover:border-gold hover:text-gold"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-[11px] uppercase tracking-widest text-gold">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream/50 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-cream/30">© 2026 Aurum. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-cream/30">
            <a href="#" className="transition-colors hover:text-cream">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-cream">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-cream">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
