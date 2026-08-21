export type Product = {
  id: number;
  name: string;
    slug?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  details: string[];
  rating: number;
  reviews: number;
  images: string[];
  colors: string[];
  sizes: string[];
  badge?: string;
  inStock: boolean;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

const pexels = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

export const categories: Category[] = [
  { id: 'watches', name: 'Watches', description: 'Timeless precision crafted for the discerning.', image: pexels(190819), productCount: 24 },
  { id: 'bags', name: 'Bags', description: 'Handcrafted leather goods for every occasion.', image: pexels(1152077), productCount: 18 },
  { id: 'jewelry', name: 'Jewelry', description: 'Exquisite pieces that tell your story.', image: pexels(1191531), productCount: 32 },
  { id: 'fragrance', name: 'Fragrance', description: 'Signature scents that linger in memory.', image: pexels(965989), productCount: 15 },
  { id: 'eyewear', name: 'Eyewear', description: 'Optical excellence and bold statements.', image: pexels(701877), productCount: 12 },
  { id: 'footwear', name: 'Footwear', description: 'Step into luxury with every stride.', image: pexels(2589653), productCount: 20 },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Aurum Chronograph',
    brand: 'Maison Aurelle',
    price: 2850,
    originalPrice: 3400,
    category: 'watches',
    description: 'A masterwork of horological engineering, the Aurum Chronograph features a Swiss automatic movement housed in 18k gold-plated stainless steel.',
    details: ['Swiss automatic movement', '18k gold-plated case', 'Sapphire crystal glass', '50m water resistance', 'Italian leather strap'],
    rating: 4.9,
    reviews: 142,
    images: [pexels(190819), pexels(277390), pexels(3657154)],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['40mm', '42mm', '44mm'],
    badge: 'Bestseller',
    inStock: true,
  },
  {
    id: 2,
    name: 'Noir Tote Bag',
    brand: 'Velluto',
    price: 1290,
    category: 'bags',
    description: 'Handcrafted from full-grain Italian calfskin, the Noir Tote is a statement of understated luxury and everyday functionality.',
    details: ['Full-grain Italian calfskin', 'Hand-stitched seams', 'Suede-lined interior', 'Gold-tone hardware', 'Dust bag included'],
    rating: 4.8,
    reviews: 89,
    images: [pexels(1152077), pexels(904350), pexels(7679720)],
    colors: ['Black', 'Cognac', 'Cream'],
    sizes: ['Medium', 'Large'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 3,
    name: 'Étoile Diamond Ring',
    brand: 'Lumière',
    price: 4200,
    category: 'jewelry',
    description: 'A brilliant-cut solitaire diamond set in hand-polished platinum. The Étoile ring is an eternal symbol of refined love.',
    details: ['0.8ct brilliant-cut diamond', 'VS1 clarity', 'Platinum band', 'GIA certified', 'Lifetime warranty'],
    rating: 5.0,
    reviews: 34,
    images: [pexels(1191531), pexels(1454171), pexels(9207327)],
    colors: ['Platinum', 'Rose Gold', 'White Gold'],
    sizes: ['4', '5', '6', '7', '8'],
    badge: 'Exclusive',
    inStock: true,
  },
  {
    id: 4,
    name: 'Ambre Noir Eau de Parfum',
    brand: 'Maison Aurelle',
    price: 320,
    category: 'fragrance',
    description: 'An intoxicating blend of amber, oud, and bergamot. Ambre Noir is a warm, sensual fragrance for the modern connoisseur.',
    details: ['100ml Eau de Parfum', 'Top: Bergamot, Saffron', 'Heart: Amber, Oud', 'Base: Sandalwood, Musk', 'Unisex'],
    rating: 4.7,
    reviews: 256,
    images: [pexels(965989), pexels(965987), pexels(2643832)],
    colors: ['100ml', '50ml'],
    sizes: [],
    inStock: true,
  },
  {
    id: 5,
    name: 'Aviateur Sunglasses',
    brand: 'Lumière',
    price: 480,
    originalPrice: 620,
    category: 'eyewear',
    description: 'Hand-finished acetate frames with polarized lenses. The Aviateur combines classic aviation style with modern luxury.',
    details: ['Italian acetate frame', 'Polarized UV400 lenses', 'Gold-tone bridge', 'Leather case included', 'Adjustable nose pads'],
    rating: 4.6,
    reviews: 78,
    images: [pexels(701877), pexels(343720), pexels(3935033)],
    colors: ['Tortoise', 'Black', 'Crystal'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 6,
    name: 'Monaco Leather Loafers',
    brand: 'Velluto',
    price: 890,
    category: 'footwear',
    description: 'Penny loafers handcrafted from glazed Italian calf leather with a leather sole and cushioned insole for all-day comfort.',
    details: ['Glazed Italian calf leather', 'Leather sole', 'Cushioned insole', 'Goodyear welted', 'Made in Italy'],
    rating: 4.8,
    reviews: 112,
    images: [pexels(2589653), pexels(1598505), pexels(2421371)],
    colors: ['Black', 'Burgundy', 'Cognac'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    inStock: true,
  },
  {
    id: 7,
    name: 'Céleste Pearl Necklace',
    brand: 'Lumière',
    price: 1850,
    category: 'jewelry',
    description: 'Akoya cultured pearls strung on silk and finished with an 18k gold clasp. A timeless piece for the modern woman.',
    details: ['Akoya cultured pearls', '18k gold clasp', 'Hand-strung on silk', '45cm length', 'Presentation box included'],
    rating: 4.9,
    reviews: 67,
    images: [pexels(1454171), pexels(1191531), pexels(9207327)],
    colors: ['White Gold', 'Yellow Gold'],
    sizes: ['40cm', '45cm', '50cm'],
    inStock: true,
  },
  {
    id: 8,
    name: 'Heritage Backpack',
    brand: 'Velluto',
    price: 1450,
    category: 'bags',
    description: 'A refined backpack in waxed canvas and leather, designed for the urban professional who values both form and function.',
    details: ['Waxed canvas body', 'Leather trims', 'Padded laptop compartment', 'Brass hardware', 'Water-resistant'],
    rating: 4.7,
    reviews: 54,
    images: [pexels(904350), pexels(1152077), pexels(7679720)],
    colors: ['Olive', 'Charcoal', 'Navy'],
    sizes: ['Standard'],
    badge: 'New',
    inStock: true,
  },
  {
    id: 9,
    name: 'Méridien GMT Watch',
    brand: 'Maison Aurelle',
    price: 3650,
    category: 'watches',
    description: 'A GMT complication for the global traveler. Track two time zones with precision and elegance.',
    details: ['Swiss GMT movement', 'Stainless steel case', 'Ceramic bezel', '100m water resistance', 'Steel bracelet'],
    rating: 4.8,
    reviews: 91,
    images: [pexels(277390), pexels(190819), pexels(3657154)],
    colors: ['Steel', 'Two-Tone'],
    sizes: ['40mm', '42mm'],
    inStock: true,
  },
  {
    id: 10,
    name: 'Velvet Oud Parfum',
    brand: 'Maison Aurelle',
    price: 450,
    category: 'fragrance',
    description: 'A deep, woody composition centered on rare Cambodian oud, enriched with rose and leather accords.',
    details: ['75ml Extrait de Parfum', 'Cambodian oud', 'Rose and leather accords', 'Hand-poured', 'Limited edition'],
    rating: 4.9,
    reviews: 43,
    images: [pexels(965987), pexels(965989), pexels(2643832)],
    colors: ['75ml'],
    sizes: [],
    badge: 'Limited',
    inStock: true,
  },
  {
    id: 11,
    name: 'Rétro Round Eyeglasses',
    brand: 'Lumière',
    price: 390,
    category: 'eyewear',
    description: 'Round metal frames with acetate temples. A vintage-inspired silhouette for the modern intellectual.',
    details: ['Titanium frame', 'Acetate temples', 'Prescription-ready', 'Adjustable pads', 'Case included'],
    rating: 4.5,
    reviews: 39,
    images: [pexels(343720), pexels(701877), pexels(3935033)],
    colors: ['Gold', 'Gunmetal', 'Antique Silver'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: 12,
    name: 'Capri Suede Sneakers',
    brand: 'Velluto',
    price: 720,
    originalPrice: 890,
    category: 'footwear',
    description: 'Minimalist low-top sneakers in premium suede with a vulcanized rubber sole. Effortless Italian luxury.',
    details: ['Italian suede upper', 'Vulcanized rubber sole', 'Leather lining', 'Cushioned footbed', 'Made in Portugal'],
    rating: 4.6,
    reviews: 134,
    images: [pexels(1598505), pexels(2589653), pexels(2421371)],
    colors: ['Sand', 'Olive', 'Navy'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    inStock: false,
  },
];

export const getProductById = (id: number): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId: string): Product[] =>
  products.filter((p) => p.category === categoryId);

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};
