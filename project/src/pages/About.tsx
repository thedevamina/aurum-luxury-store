import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, Globe, Sparkles, Heart, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

const values = [
  { icon: Award, title: 'Craftsmanship', desc: 'Each piece is crafted by master artisans with decades of experience.' },
  { icon: Globe, title: 'Heritage', desc: 'A century of expertise, passed down through generations.' },
  { icon: Sparkles, title: 'Excellence', desc: 'We source only the finest materials from trusted ateliers.' },
  { icon: Heart, title: 'Passion', desc: 'A deep love for beauty drives everything we create.' },
];

const milestones = [
  { year: '1924', title: 'The Beginning', desc: 'Founded in Paris by a master watchmaker with a vision for timeless elegance.' },
  { year: '1958', title: 'International Expansion', desc: 'Opened our first boutique on Fifth Avenue, New York.' },
  { year: '1990', title: 'The Maison Grows', desc: 'Expanded into leather goods and fine jewelry collections.' },
  { year: '2026', title: 'Modern Era', desc: 'Bringing luxury to the digital age while preserving our heritage.' },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3750141/pexels-photo-3750141.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Atelier"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/70 to-ink-900" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-5xl text-cream md:text-7xl"
          >
            A Century of
            <br />
            <span className="text-gold-gradient">Refined Luxury</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/50"
          >
            Since 1924, Aurum has been synonymous with exceptional craftsmanship,
            timeless design, and an unwavering commitment to the extraordinary.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading eyebrow="Our Philosophy" title="What We Stand For" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30">
                <value.icon size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl text-cream">{value.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-cream/50">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink-800 py-20">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <SectionHeading eyebrow="Heritage" title="Our Journey" />
          <div className="mt-16 space-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col gap-4 md:flex-row md:items-center ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                <div className="flex-shrink-0 md:w-1/3">
                  <p className="font-serif text-5xl text-gold-gradient">{m.year}</p>
                </div>
                <div className="glass flex-1 p-6">
                  <h3 className="font-serif text-2xl text-cream">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/50">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center md:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Discover the Collection"
          subtitle="Explore the pieces that define a century of craftsmanship."
        />
        <div className="mt-8">
          <Button to="/shop" size="lg">
            Explore Now <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
