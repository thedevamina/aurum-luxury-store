
import { useState } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm rounded-lg border border-white/10 bg-ink-800 p-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl text-cream">AURUM Admin</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-gold">Staff Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-widest text-cream/50">Email</label>
            <div className="relative mt-1">
              <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 pl-6 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-cream/50">Password</label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-cream/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-white/10 bg-transparent py-2 pl-6 text-sm text-cream focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 bg-gold py-3 text-xs font-semibold uppercase tracking-widest text-ink-900 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}