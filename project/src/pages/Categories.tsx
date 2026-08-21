
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/data/products';
import { fetchCategories } from '@/lib/products';
import SectionHeading from '@/components/ui/SectionHeading';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
  fetchCategories()
    .then((data) => {
      console.log('CATEGORIES:', data);
      setCategories(data);
    })
    .catch((error) => {
      console.error('CATEGORY ERROR:', error);
      setCategories([]);
    })
    .finally(() => {
      setIsLoading(false);
    });
}, []);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Explore"
          title="Shop by Category"
          subtitle="Discover our carefully curated collections."
        />

        {isLoading ? (
          <div className="mt-12 text-center text-cream/60">
            Loading...
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="group relative block aspect-[4/3] overflow-hidden bg-ink-700"
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-[10px] uppercase tracking-widest text-gold">
                      {cat.productCount} Pieces
                    </p>

                    <h3 className="mt-1 font-serif text-3xl text-cream">
                      {cat.name}
                    </h3>

                    <p className="mt-2 max-w-xs text-sm text-cream/50">
                      {cat.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70 transition-colors group-hover:text-gold">
                      Shop Now <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}