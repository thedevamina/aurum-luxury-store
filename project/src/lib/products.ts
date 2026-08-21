import { apiFetch } from '@/lib/api';
import type { Product, Category } from '@/data/products';

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  category: { id: number; name: string; slug: string } | null;
  description: string | null;
  details: string[] | null;
  images: string[] | null;
  colors: string[] | null;
  sizes: string[] | null;
  badge: string | null;
  in_stock: boolean;
  rating: number;
  reviews_count: number;
};

type ApiCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count: number;
};

type PaginatedResponse<T> = {
  data: T[];
  meta?: { current_page: number; last_page: number; total: number };
};

export function mapProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand ?? '',
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    category: p.category?.slug ?? '',
    description: p.description ?? '',
    details: p.details ?? [],
    rating: p.rating,
    reviews: p.reviews_count,
    images: p.images ?? [],
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    badge: p.badge ?? undefined,
    inStock: p.in_stock,
  };
}

function mapCategory(c: ApiCategory): Category {
  return {
    id: c.slug,
    name: c.name,
    
    description: c.description ?? '',
    image: c.image ?? '',
    productCount: c.product_count,
  };
}

export async function fetchProducts(params?: {
  category?: string;
  sort?: string;
  page?: number;
}): Promise<{ products: Product[]; totalPages: number }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page) query.set('page', String(params.page));

  const res = await apiFetch<PaginatedResponse<ApiProduct>>(
    `/api/products${query.toString() ? `?${query}` : ''}`
  );

  return {
    products: res.data.map(mapProduct),
    totalPages: res.meta?.last_page ?? 1,
  };
}

export async function fetchProductBySlugOrId(idOrSlug: string): Promise<Product | null> {
  try {
    const res = await apiFetch<{ data: ApiProduct }>(`/api/products/${idOrSlug}`);
    return mapProduct(res.data);
  } catch {
    return null;
  }
}

export async function searchProductsApi(query: string): Promise<Product[]> {
  const res = await apiFetch<PaginatedResponse<ApiProduct>>(
    `/api/products/search?q=${encodeURIComponent(query)}`
  );
  return res.data.map(mapProduct);
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiFetch<{ data: ApiCategory[] }>('/api/categories');
  return res.data.map(mapCategory);
}

export type AdminProduct = {
  id: number;
  category: { id: number; name: string };
  name: string;
  slug: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  description: string | null;
  stock_quantity: number;
  in_stock: boolean;
  is_published: boolean;
  images: string[] | null;
};

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const res = await apiFetch<{ data: AdminProduct[] }>('/api/admin/products');
  return res.data;
}

export async function createAdminProduct(formData: FormData): Promise<AdminProduct> {
  const res = await apiFetch<{ data: AdminProduct }>('/api/admin/products', {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function updateAdminProduct(id: number, formData: FormData): Promise<AdminProduct> {
  const res = await apiFetch<{ data: AdminProduct }>(`/api/admin/products/${id}`, {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function deleteAdminProduct(id: number): Promise<void> {
  await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export type AdminCategoryOption = { id: number; name: string };

export async function fetchAdminCategoryOptions(): Promise<AdminCategoryOption[]> {
  const res = await apiFetch<{ data: { id: number; name: string }[] }>('/api/categories');
  return res.data.map((c) => ({ id: c.id, name: c.name }));
}

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  product_count: number;
};

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await apiFetch<{ data: AdminCategory[] }>('/api/admin/categories');
  return res.data;
}

export async function createAdminCategory(formData: FormData): Promise<AdminCategory> {
  const res = await apiFetch<{ data: AdminCategory }>('/api/admin/categories', {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function updateAdminCategory(id: number, formData: FormData): Promise<AdminCategory> {
  const res = await apiFetch<{ data: AdminCategory }>(`/api/admin/categories/${id}`, {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function deleteAdminCategory(id: number): Promise<void> {
  await apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

export type AdminBanner = {
  id: number;
  title: string;
  subtitle: string | null;
  image: string;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchAdminBanners(): Promise<AdminBanner[]> {
  return apiFetch<AdminBanner[]>('/api/admin/banners');
}

export async function createAdminBanner(formData: FormData): Promise<AdminBanner> {
  return apiFetch<AdminBanner>('/api/admin/banners', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAdminBanner(id: number, formData: FormData): Promise<AdminBanner> {
  return apiFetch<AdminBanner>(`/api/admin/banners/${id}`, {
    method: 'POST',
    body: formData,
  });
}

export async function deleteAdminBanner(id: number): Promise<void> {
  await apiFetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
}

export type AdminContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchAdminContactMessages(): Promise<AdminContactMessage[]> {
  const res = await apiFetch<{ data: AdminContactMessage[] }>('/api/admin/contact-messages');
  return res.data;
}

export async function markAdminContactMessageAsRead(id: number): Promise<void> {
  await apiFetch(`/api/admin/contact-messages/${id}/read`, { method: 'PATCH' });
}

export async function deleteAdminContactMessage(id: number): Promise<void> {
  await apiFetch(`/api/admin/contact-messages/${id}`, { method: 'DELETE' });
}

export type AdminActivityLog = {
  id: number;
  user: { id: number; name: string; email: string } | null;
  action: string;
  subject_type: string | null;
  subject_id: number | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchAdminActivityLogs(): Promise<AdminActivityLog[]> {
  const res = await apiFetch<{ data: AdminActivityLog[] }>('/api/admin/activity-logs');
  return res.data;
}

export type AdminSalesReport = {
  summary: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    orders_by_status: Record<string, number>;
  };
  top_products: Array<{
    product_name: string;
    total_sold: number;
    total_revenue: number;
  }>;
  low_stock: Array<{
    id: number;
    name: string;
    stock_quantity: number;
  }>;
};

export async function fetchAdminSalesReport(): Promise<AdminSalesReport> {
  return apiFetch<AdminSalesReport>('/api/admin/reports/sales');
}

export type AdminCoupon = {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
};

export async function fetchAdminCoupons(): Promise<AdminCoupon[]> {
  const res = await apiFetch<{ data: AdminCoupon[] }>('/api/admin/coupons');
  return res.data;
}

export async function createAdminCoupon(payload: Record<string, unknown>): Promise<AdminCoupon> {
  const res = await apiFetch<AdminCoupon>('/api/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res;
}

export async function updateAdminCoupon(id: number, payload: Record<string, unknown>): Promise<AdminCoupon> {
  const res = await apiFetch<AdminCoupon>(`/api/admin/coupons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res;
}

export async function deleteAdminCoupon(id: number): Promise<void> {
  await apiFetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
}

export type AdminStaff = {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string | null;
};

export async function fetchAdminStaff(): Promise<AdminStaff[]> {
  const res = await apiFetch<{ data: AdminStaff[] }>('/api/admin/staff');
  return res.data;
}

export async function createAdminStaff(payload: { name: string; email: string; password: string }): Promise<AdminStaff> {
  const res = await apiFetch<{ data: AdminStaff }>('/api/admin/staff', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteAdminStaff(id: number): Promise<void> {
  await apiFetch(`/api/admin/staff/${id}`, { method: 'DELETE' });
}

export type AdminCustomer = {
  id: number;
  name: string;
  email: string;
  order_count: number;
  total_spent: number;
  joined: string | null;
};

export type AdminCustomerDetail = {
  customer: AdminCustomer;
  orders: AdminOrder[];
};

export async function fetchAdminCustomers(): Promise<AdminCustomer[]> {
  const res = await apiFetch<{ data: AdminCustomer[] }>('/api/admin/customers');
  return res.data;
}

export async function fetchAdminCustomer(id: number): Promise<AdminCustomerDetail> {
  const res = await apiFetch<{ data: AdminCustomerDetail }>(`/api/admin/customers/${id}`);
  return res.data;
}

export type AdminReviewStatus = 'Approved' | 'Pending';

export type AdminReview = {
  id: number;
  product_name: string;
  product_slug: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  status: AdminReviewStatus;
  created_at: string;
};

export async function fetchAdminReviews(): Promise<AdminReview[]> {
  const res = await apiFetch<{ data: AdminReview[] }>('/api/admin/reviews');
  return res.data;
}

export async function approveAdminReview(id: number): Promise<AdminReview> {
  const res = await apiFetch<{ data: AdminReview }>(`/api/admin/reviews/${id}/approve`, {
    method: 'PATCH',
  });
  return res.data;
}

export async function rejectAdminReview(id: number): Promise<void> {
  await apiFetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
}

export type AdminOrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type AdminOrderItem = {
  id: number;
  product_name: string;
  price: number;
  color: string | null;
  size: string | null;
  quantity: number;
  line_total: number;
};

export type AdminOrder = {
  order_number: string;
  status: AdminOrderStatus;
  subtotal: number;
  shipping_cost: number;
  coupon_code: string | null;
  discount_amount: number;
  total: number;
  customer: { name: string; email: string };
  shipping: {
    name: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    postal_code: string;
    country: string;
    phone: string | null;
  };
  items: AdminOrderItem[];
  created_at: string;
};

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await apiFetch<{ data: AdminOrder[] }>('/api/admin/orders');
  return res.data;
}

export async function updateAdminOrderStatus(orderNumber: string, status: AdminOrderStatus): Promise<AdminOrder> {
  const res = await apiFetch<{ data: AdminOrder }>(`/api/admin/orders/${orderNumber}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return res.data;
}