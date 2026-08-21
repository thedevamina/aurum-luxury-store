import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { ApiError, apiFetch } from '@/lib/api';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSent(false);
    setErrors({});

    try {
      const name = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website: '',
        }),
      });

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fieldErrors = Object.fromEntries(
          Object.entries(error.errors).map(([field, messages]) => [field, messages[0] ?? 'Invalid value'])
        );

        setErrors(fieldErrors);
      } else {
        setErrors({ form: error instanceof ApiError ? error.message : 'Failed to send your message.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-20 md:px-8">
      <SectionHeading
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="Our client advisors are at your service for any inquiry, from product details to bespoke requests."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {[
            { icon: Mail, title: 'Email', value: 'aurun@gmail.com', desc: 'We respond within 24 hours' },
            { icon: Phone, title: 'Phone', value: '+1 (800) AURUM-01', desc: 'Mon–Fri, 9am–8pm EST' },
            { icon: MapPin, title: 'Flagship Boutique', value: '5th Avenue, New York', desc: 'Open daily, 10am–9pm' },
          ].map((item, i) => (
            <div key={i} className="glass flex items-start gap-4 p-6">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-gold/30">
                <item.icon size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gold">{item.title}</p>
                <p className="mt-1 font-serif text-xl text-cream">{item.value}</p>
                <p className="mt-1 text-xs text-cream/40">{item.desc}</p>
              </div>
            </div>
          ))}

          <div className="glass p-6">
            <h3 className="mb-3 text-xs uppercase tracking-widest text-gold">Private Appointments</h3>
            <p className="text-sm leading-relaxed text-cream/50">
              For a personalized experience, book a private viewing at our flagship boutique.
              Our advisors will guide you through our collections in an intimate setting.
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-strong p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/50">First Name</label>
                <input
                  name="firstName"
                  className="input-luxury"
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                />
                {errors.name && <p className="mt-2 text-xs text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-cream/50">Last Name</label>
                <input
                  name="lastName"
                  className="input-luxury"
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Email</label>
              <input
                name="email"
                type="email"
                className="input-luxury"
                placeholder="john@example.com"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
              {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Subject</label>
              <input
                name="subject"
                className="input-luxury"
                placeholder="How can we help?"
                required
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
              />
              {errors.subject && <p className="mt-2 text-xs text-red-400">{errors.subject}</p>}
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-cream/50">Message</label>
              <textarea
                name="message"
                rows={5}
                className="input-luxury resize-none"
                placeholder="Your message..."
                required
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
              />
              {errors.message && <p className="mt-2 text-xs text-red-400">{errors.message}</p>}
            </div>
            {errors.form && <p className="text-center text-xs text-red-400">{errors.form}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="gold-gradient flex w-full items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest text-ink-900"
            >
              <Send size={16} /> {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {sent && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-gold"
              >
                Thank you. Your message has been sent.
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
