// Centralized mock data for the Aurum admin panel.
// Replace these exports with Laravel API calls when the backend is ready.

export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Draft' | 'Archived';
  image: string;
  sales: number;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  products: number;
  status: 'Active' | 'Inactive';
  image: string;
};

export type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
  payment: 'Paid' | 'Pending' | 'Refunded';
};

export type Customer = {
  id: number;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
  status: 'Active' | 'Inactive';
  avatar: string;
};

export type Coupon = {
  id: number;
  code: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  used: number;
  limit: number;
  expires: string;
  status: 'Active' | 'Expired' | 'Scheduled';
};

export type Review = {
  id: number;
  product: string;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type Banner = {
  id: number;
  title: string;
  position: string;
  status: 'Active' | 'Inactive';
  image: string;
  clicks: number;
};

export type Staff = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
};

export type ActivityLog = {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'logout';
};

export type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'system' | 'review' | 'customer';
  read: boolean;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Replied';
};

const img = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200`;

export const products: Product[] = [
  { id: 1, name: 'Aurum Chronograph', sku: 'AUR-WT-001', category: 'Watches', price: 2850, stock: 24, status: 'Active', image: img(190819), sales: 142 },
  { id: 2, name: 'Noir Tote Bag', sku: 'VLV-BG-002', category: 'Bags', price: 1290, stock: 18, status: 'Active', image: img(1152077), sales: 89 },
  { id: 3, name: 'Étoile Diamond Ring', sku: 'LUM-JW-003', category: 'Jewelry', price: 4200, stock: 8, status: 'Active', image: img(1191531), sales: 34 },
  { id: 4, name: 'Ambre Noir EDP', sku: 'MAU-FR-004', category: 'Fragrance', price: 320, stock: 56, status: 'Active', image: img(965989), sales: 256 },
  { id: 5, name: 'Aviateur Sunglasses', sku: 'LUM-EY-005', category: 'Eyewear', price: 480, stock: 0, status: 'Active', image: img(701877), sales: 78 },
  { id: 6, name: 'Monaco Loafers', sku: 'VLV-FW-006', category: 'Footwear', price: 890, stock: 32, status: 'Active', image: img(2589653), sales: 112 },
  { id: 7, name: 'Céleste Pearl Necklace', sku: 'LUM-JW-007', category: 'Jewelry', price: 1850, stock: 12, status: 'Active', image: img(1454171), sales: 67 },
  { id: 8, name: 'Heritage Backpack', sku: 'VLV-BG-008', category: 'Bags', price: 1450, stock: 15, status: 'Draft', image: img(904350), sales: 54 },
  { id: 9, name: 'Méridien GMT Watch', sku: 'AUR-WT-009', category: 'Watches', price: 3650, stock: 10, status: 'Active', image: img(277390), sales: 91 },
  { id: 10, name: 'Velvet Oud Parfum', sku: 'MAU-FR-010', category: 'Fragrance', price: 450, stock: 28, status: 'Active', image: img(965987), sales: 43 },
  { id: 11, name: 'Rétro Round Eyeglasses', sku: 'LUM-EY-011', category: 'Eyewear', price: 390, stock: 20, status: 'Archived', image: img(343720), sales: 39 },
  { id: 12, name: 'Capri Suede Sneakers', sku: 'VLV-FW-012', category: 'Footwear', price: 720, stock: 0, status: 'Active', image: img(1598505), sales: 134 },
];

export const categories: Category[] = [
  { id: 1, name: 'Watches', slug: 'watches', products: 24, status: 'Active', image: img(190819) },
  { id: 2, name: 'Bags', slug: 'bags', products: 18, status: 'Active', image: img(1152077) },
  { id: 3, name: 'Jewelry', slug: 'jewelry', products: 32, status: 'Active', image: img(1191531) },
  { id: 4, name: 'Fragrance', slug: 'fragrance', products: 15, status: 'Active', image: img(965989) },
  { id: 5, name: 'Eyewear', slug: 'eyewear', products: 12, status: 'Active', image: img(701877) },
  { id: 6, name: 'Footwear', slug: 'footwear', products: 20, status: 'Active', image: img(2589653) },
  { id: 7, name: 'Accessories', slug: 'accessories', products: 8, status: 'Inactive', image: img(904350) },
];

export const orders: Order[] = [
  { id: 'AUR-2026-001', customer: 'Eleanor Vance', email: 'eleanor@email.com', date: 'Jul 15, 2026', total: 2850, status: 'Delivered', items: 1, payment: 'Paid' },
  { id: 'AUR-2026-002', customer: 'Marcus Bellini', email: 'marcus@email.com', date: 'Jul 18, 2026', total: 1290, status: 'Shipped', items: 1, payment: 'Paid' },
  { id: 'AUR-2026-003', customer: 'Sofia Chen', email: 'sofia@email.com', date: 'Jul 20, 2026', total: 720, status: 'Processing', items: 1, payment: 'Pending' },
  { id: 'AUR-2026-004', customer: 'James Whitmore', email: 'james@email.com', date: 'Jul 21, 2026', total: 4200, status: 'Pending', items: 1, payment: 'Pending' },
  { id: 'AUR-2026-005', customer: 'Amara Okafor', email: 'amara@email.com', date: 'Jul 22, 2026', total: 5340, status: 'Delivered', items: 2, payment: 'Paid' },
  { id: 'AUR-2026-006', customer: 'Henrik Larsen', email: 'henrik@email.com', date: 'Jul 22, 2026', total: 320, status: 'Cancelled', items: 1, payment: 'Refunded' },
  { id: 'AUR-2026-007', customer: 'Yuki Tanaka', email: 'yuki@email.com', date: 'Jul 23, 2026', total: 1850, status: 'Processing', items: 1, payment: 'Paid' },
  { id: 'AUR-2026-008', customer: 'Isabella Romano', email: 'isabella@email.com', date: 'Jul 23, 2026', total: 890, status: 'Shipped', items: 1, payment: 'Paid' },
];

export const customers: Customer[] = [
  { id: 1, name: 'Eleanor Vance', email: 'eleanor@email.com', orders: 12, spent: 34200, joined: 'Jan 2024', status: 'Active', avatar: img(1) },
  { id: 2, name: 'Marcus Bellini', email: 'marcus@email.com', orders: 8, spent: 18600, joined: 'Mar 2024', status: 'Active', avatar: img(2) },
  { id: 3, name: 'Sofia Chen', email: 'sofia@email.com', orders: 5, spent: 7200, joined: 'Jun 2024', status: 'Active', avatar: img(3) },
  { id: 4, name: 'James Whitmore', email: 'james@email.com', orders: 15, spent: 52800, joined: 'Jan 2024', status: 'Active', avatar: img(4) },
  { id: 5, name: 'Amara Okafor', email: 'amara@email.com', orders: 3, spent: 9600, joined: 'Sep 2025', status: 'Active', avatar: img(5) },
  { id: 6, name: 'Henrik Larsen', email: 'henrik@email.com', orders: 2, spent: 640, joined: 'Nov 2025', status: 'Inactive', avatar: img(6) },
  { id: 7, name: 'Yuki Tanaka', email: 'yuki@email.com', orders: 7, spent: 14500, joined: 'Feb 2025', status: 'Active', avatar: img(7) },
  { id: 8, name: 'Isabella Romano', email: 'isabella@email.com', orders: 9, spent: 21300, joined: 'Apr 2024', status: 'Active', avatar: img(8) },
];

export const coupons: Coupon[] = [
  { id: 1, code: 'WELCOME10', type: 'Percentage', value: 10, used: 234, limit: 500, expires: 'Dec 31, 2026', status: 'Active' },
  { id: 2, code: 'LUXURY50', type: 'Fixed', value: 50, used: 89, limit: 200, expires: 'Aug 31, 2026', status: 'Active' },
  { id: 3, code: 'VIP20', type: 'Percentage', value: 20, used: 45, limit: 100, expires: 'Sep 15, 2026', status: 'Active' },
  { id: 4, code: 'SUMMER2025', type: 'Percentage', value: 15, used: 500, limit: 500, expires: 'Aug 31, 2025', status: 'Expired' },
  { id: 5, code: 'BLACKFRI', type: 'Fixed', value: 200, used: 0, limit: 1000, expires: 'Nov 30, 2026', status: 'Scheduled' },
];

export const reviews: Review[] = [
  { id: 1, product: 'Aurum Chronograph', customer: 'Eleanor Vance', rating: 5, comment: 'Absolutely stunning craftsmanship. Exceeded all expectations.', date: 'Jul 20, 2026', status: 'Approved' },
  { id: 2, product: 'Noir Tote Bag', customer: 'Marcus Bellini', rating: 4, comment: 'Beautiful leather, slightly stiff at first but breaks in nicely.', date: 'Jul 19, 2026', status: 'Approved' },
  { id: 3, product: 'Ambre Noir EDP', customer: 'Sofia Chen', rating: 5, comment: 'The scent is intoxicating. Lasts all day.', date: 'Jul 21, 2026', status: 'Pending' },
  { id: 4, product: 'Monaco Loafers', customer: 'James Whitmore', rating: 3, comment: 'Comfortable but sizing runs a bit large.', date: 'Jul 18, 2026', status: 'Pending' },
  { id: 5, product: 'Capri Suede Sneakers', customer: 'Amara Okafor', rating: 1, comment: 'Sole came apart after two weeks. Very disappointed.', date: 'Jul 17, 2026', status: 'Rejected' },
];

export const banners: Banner[] = [
  { id: 1, title: 'Heritage Collection', position: 'Home Hero', status: 'Active', image: img(996329), clicks: 12400 },
  { id: 2, title: 'Summer Edit', position: 'Home Banner', status: 'Active', image: img(3750141), clicks: 8200 },
  { id: 3, title: 'Winter Preview', position: 'Shop Top', status: 'Inactive', image: img(190819), clicks: 0 },
];

export const staff: Staff[] = [
  { id: 1, name: 'Admin User', email: 'admin@aurum.com', role: 'Super Admin', status: 'Active', lastActive: '2 min ago', avatar: img(1) },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah@aurum.com', role: 'Store Manager', status: 'Active', lastActive: '1 hour ago', avatar: img(2) },
  { id: 3, name: 'David Kim', email: 'david@aurum.com', role: 'Content Editor', status: 'Active', lastActive: '3 hours ago', avatar: img(3) },
  { id: 4, name: 'Olivia Brown', email: 'olivia@aurum.com', role: 'Customer Support', status: 'Active', lastActive: '5 hours ago', avatar: img(4) },
  { id: 5, name: 'Tom Wilson', email: 'tom@aurum.com', role: 'Inventory Manager', status: 'Inactive', lastActive: '2 days ago', avatar: img(5) },
];

export const activityLogs: ActivityLog[] = [
  { id: 1, user: 'Admin User', action: 'Updated product', target: 'Aurum Chronograph', time: '2 min ago', type: 'update' },
  { id: 2, user: 'Sarah Mitchell', action: 'Approved review', target: 'Noir Tote Bag', time: '15 min ago', type: 'update' },
  { id: 3, user: 'David Kim', action: 'Created banner', target: 'Summer Edit', time: '1 hour ago', type: 'create' },
  { id: 4, user: 'Admin User', action: 'Deleted coupon', target: 'SUMMER2025', time: '2 hours ago', type: 'delete' },
  { id: 5, user: 'Olivia Brown', action: 'Replied to message', target: 'Order inquiry #AUR-2026-003', time: '3 hours ago', type: 'update' },
  { id: 6, user: 'Tom Wilson', action: 'Logged in', target: 'Staff portal', time: '5 hours ago', type: 'login' },
  { id: 7, user: 'Admin User', action: 'Logged out', target: 'Staff portal', time: '8 hours ago', type: 'logout' },
  { id: 8, user: 'David Kim', action: 'Created product', target: 'Velvet Oud Parfum', time: '1 day ago', type: 'create' },
];

export const notifications: Notification[] = [
  { id: 1, title: 'New Order', message: 'Order AUR-2026-008 received from Isabella Romano', time: '5 min ago', type: 'order', read: false },
  { id: 2, title: 'New Review', message: 'Sofia Chen left a 5-star review on Ambre Noir EDP', time: '20 min ago', type: 'review', read: false },
  { id: 3, title: 'Low Stock Alert', message: 'Étoile Diamond Ring has only 8 units left', time: '1 hour ago', type: 'system', read: false },
  { id: 4, title: 'New Customer', message: 'Henrik Larsen registered an account', time: '2 hours ago', type: 'customer', read: true },
  { id: 5, title: 'Payment Received', message: 'Payment of $1,850 confirmed for order AUR-2026-007', time: '3 hours ago', type: 'order', read: true },
  { id: 6, title: 'System Update', message: 'Admin panel updated to version 2.4.0', time: '1 day ago', type: 'system', read: true },
];

export const contactMessages: ContactMessage[] = [
  { id: 1, name: 'Eleanor Vance', email: 'eleanor@email.com', subject: 'Custom order inquiry', message: 'I would like to inquire about a bespoke piece — a custom engraved chronograph for an anniversary gift.', date: 'Jul 23, 2026', status: 'New' },
  { id: 2, name: 'Marcus Bellini', email: 'marcus@email.com', subject: 'Shipping delay', message: 'My order AUR-2026-002 seems to be delayed. Could you provide an update?', date: 'Jul 22, 2026', status: 'Read' },
  { id: 3, name: 'Sofia Chen', email: 'sofia@email.com', subject: 'Product availability', message: 'Will the Capri Suede Sneakers be restocked soon?', date: 'Jul 21, 2026', status: 'Replied' },
  { id: 4, name: 'James Whitmore', email: 'james@email.com', subject: 'Partnership proposal', message: 'Our boutique is interested in a wholesale partnership with Aurum.', date: 'Jul 20, 2026', status: 'New' },
];

// Chart data
export const revenueData = [
  { label: 'Jan', value: 42000 },
  { label: 'Feb', value: 38000 },
  { label: 'Mar', value: 51000 },
  { label: 'Apr', value: 47000 },
  { label: 'May', value: 63000 },
  { label: 'Jun', value: 58000 },
  { label: 'Jul', value: 72000 },
  { label: 'Aug', value: 68000 },
  { label: 'Sep', value: 81000 },
  { label: 'Oct', value: 76000 },
  { label: 'Nov', value: 94000 },
  { label: 'Dec', value: 112000 },
];

export const ordersData = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 98 },
  { label: 'Mar', value: 145 },
  { label: 'Apr', value: 132 },
  { label: 'May', value: 178 },
  { label: 'Jun', value: 165 },
  { label: 'Jul', value: 198 },
  { label: 'Aug', value: 187 },
  { label: 'Sep', value: 215 },
  { label: 'Oct', value: 202 },
  { label: 'Nov', value: 248 },
  { label: 'Dec', value: 287 },
];

export const categoryDistribution = [
  { label: 'Watches', value: 28, color: '#c9a96a' },
  { label: 'Bags', value: 22, color: '#e6c98f' },
  { label: 'Jewelry', value: 18, color: '#a8895a' },
  { label: 'Fragrance', value: 14, color: '#d4b878' },
  { label: 'Eyewear', value: 10, color: '#b89968' },
  { label: 'Footwear', value: 8, color: '#9c7d50' },
];

export const weeklyTraffic = [
  { label: 'Mon', value: 1240 },
  { label: 'Tue', value: 1580 },
  { label: 'Wed', value: 1320 },
  { label: 'Thu', value: 1890 },
  { label: 'Fri', value: 2240 },
  { label: 'Sat', value: 2680 },
  { label: 'Sun', value: 1980 },
];
