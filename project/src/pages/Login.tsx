import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3750141/pexels-photo-3750141.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
          className="h-full w-full object-cover opacity-10"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong p-8 md:p-12">
          <div className="mb-8 text-center">
            <Link to="/" className="font-serif text-3xl text-cream">AURUM</Link>
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gold">Welcome Back</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-luxury pl-8"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-luxury pl-8"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-cream/40">
                <input type="checkbox" className="accent-gold" /> Remember me
              </label>
              <a href="#" className="text-gold hover:text-gold-light">Forgot password?</a>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-gradient flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-8 text-center text-xs text-cream/40">
            New to Aurum?{' '}
            <Link to="/register" className="text-gold hover:text-gold-light">Create an account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}