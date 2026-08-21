import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import type { Product, Category } from '@/data/products';
import { fetchProducts, fetchCategories } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts().then((res) => setProducts(res.products)).catch(() => setProducts([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const featured = products.slice(0, 4);
  const bestsellers = products.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Luxury"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-ink-900/70 to-ink-900" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold"
          >
            Maison Aurelle — Est. 1924
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl leading-tight text-cream md:text-7xl lg:text-8xl"
          >
            The Art of
            <br />
            <span className="text-gold-gradient">Luxury Living</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/50"
          >
            Discover a curated collection of timepieces, leather goods, and fine jewelry —
            crafted by master artisans for those who appreciate the extraordinary.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button to="/shop" size="lg">
              Explore Collection <ArrowRight size={16} />
            </Button>
            <Button to="/categories" variant="outline" size="lg">
              Browse Categories
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-white/10 bg-ink-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
          {[
            { icon: Truck, title: 'Complimentary Shipping', desc: 'On all orders worldwide' },
            { icon: ShieldCheck, title: 'Lifetime Warranty', desc: 'On every timepiece' },
            { icon: RotateCcw, title: '30-Day Returns', desc: 'No questions asked' },
            { icon: Sparkles, title: 'Certified Authentic', desc: 'Every piece guaranteed' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 px-4 py-8 text-center md:flex-row md:gap-4 md:text-left"
            >
              <item.icon size={24} className="text-gold" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-cream">{item.title}</p>
                <p className="text-xs text-cream/40">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured collection */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading
          eyebrow="Featured"
          title="The Signature Edit"
          subtitle="A handpicked selection of our most coveted pieces, representing the pinnacle of craftsmanship and design."
        />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button to="/shop" variant="outline">
            View All Products <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* Categories showcase */}
      <section className="bg-ink-800 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading
            eyebrow="Collections"
            title="Shop by Category"
            subtitle="Explore our curated collections, each a world of its own."
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop?category=${cat.id}`} className="group relative block aspect-[4/5] overflow-hidden bg-ink-700">
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-[10px] uppercase tracking-widest text-gold">{cat.productCount} Pieces</p>
                    <h3 className="mt-1 font-serif text-3xl text-cream">{cat.name}</h3>
                    <p className="mt-1 max-w-xs text-xs text-cream/50">{cat.description}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70 transition-colors group-hover:text-gold">
                      Discover <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionHeading
          eyebrow="Most Loved"
          title="Bestsellers"
          subtitle="The pieces our clients return for, time and time again."
        />
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh]">
          <img
            src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Editorial"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink-900/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-2xl px-4 text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold"
              >
                The Heritage Collection
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl text-cream md:text-6xl"
              >
                A Century of Craft
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mt-4 max-w-md text-sm text-cream/60"
              >
                Each piece is a testament to our unwavering commitment to excellence,
                shaped by hands that have perfected their craft over generations.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <Button to="/shop" size="lg">
                  Discover Heritage <ArrowRight size={16} />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}