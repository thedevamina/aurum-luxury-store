import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass-strong py-3' : 'bg-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl text-cream">
              AURUM
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="group relative text-xs uppercase tracking-widest text-cream/70 transition-colors hover:text-cream"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 md:gap-5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              className="text-cream/70 transition-colors hover:text-gold"
              aria-label="Search"
            >
              <Search size={19} />
            </button>
            <Link to="/profile" className="hidden text-cream/70 transition-colors hover:text-gold sm:block">
              <User size={19} />
            </Link>
            <Link to="/wishlist" className="relative text-cream/70 transition-colors hover:text-gold">
              <Heart size={19} />
              {wishCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-bold text-ink-900">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative text-cream/70 transition-colors hover:text-gold">
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-gold text-[9px] font-bold text-ink-900">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="text-cream lg:hidden"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSearch}
              className="mx-auto mt-3 max-w-7xl px-4 md:px-8"
            >
              <div className="glass flex items-center gap-3 px-4 py-3">
                <Search size={18} className="text-gold" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for luxury items..."
                  className="flex-1 bg-transparent text-sm text-cream placeholder-cream/30 focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={18} className="text-cream/40 hover:text-cream" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-72 glass-strong p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-2xl text-cream">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-cream/60 hover:text-cream">
                  <X size={22} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className="block py-3 font-serif text-2xl text-cream/80 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="mt-4 border-t border-white/10 pt-4"
                >
                  <Link to="/profile" className="block py-3 text-sm uppercase tracking-widest text-cream/60 hover:text-gold">Profile</Link>
                  <Link to="/orders" className="block py-3 text-sm uppercase tracking-widest text-cream/60 hover:text-gold">Orders</Link>
                  <Link to="/login" className="block py-3 text-sm uppercase tracking-widest text-cream/60 hover:text-gold">Sign In</Link>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
