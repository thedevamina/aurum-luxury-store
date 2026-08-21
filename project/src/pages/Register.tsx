import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await register(form.name, form.email, form.password, form.confirm);
      navigate('/profile');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.errors ?? {});
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
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-gold">Join the Maison</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-luxury pl-8"
                />
              </div>
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-300">{fieldErrors.name[0]}</p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="input-luxury pl-8"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-300">{fieldErrors.email[0]}</p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-luxury pl-8"
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-300">{fieldErrors.password[0]}</p>
              )}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="••••••••"
                  className="input-luxury pl-8"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-cream/40">
              <input type="checkbox" required className="mt-0.5 accent-gold" />
              <span>I agree to the <a href="#" className="text-gold">Terms</a> and <a href="#" className="text-gold">Privacy Policy</a></span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-gradient flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-cream/40">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}