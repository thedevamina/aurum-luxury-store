import { useEffect, useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import DataTable, { type Column } from '@/admin/components/ui/DataTable';
import { PageHeader, StatusBadge } from '@/admin/components/ui/AdminUI';
import { useToastContext } from '@/admin/context/ToastContext';
import {
  approveAdminReview,
  fetchAdminReviews,
  rejectAdminReview,
  type AdminReview,
} from '@/lib/products';

export default function Reviews() {
  const { show } = useToastContext();

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      setReviews(await fetchAdminReviews());
    } catch {
      show('Failed to load reviews', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (review: AdminReview) => {
    try {
      await approveAdminReview(review.id);
      show('Review approved');
      await loadReviews();
    } catch {
      show('Failed to approve review', 'error');
    }
  };

  const handleReject = async (review: AdminReview) => {
    if (!confirm('Reject and remove this review?')) return;
    try {
      await rejectAdminReview(review.id);
      show('Review rejected', 'error');
      await loadReviews();
    } catch {
      show('Failed to reject review', 'error');
    }
  };

  const columns: Column<AdminReview>[] = [
    {
      key: 'product_name', label: 'Product', sortable: true,
      render: (r) => (
        <div>
          <p className="text-cream">{r.product_name}</p>
          <p className="text-xs text-cream/40">{r.product_slug}</p>
        </div>
      ),
    },
    {
      key: 'customer_name', label: 'Customer', sortable: true,
      render: (r) => (
        <div>
          <p className="text-cream">{r.customer_name}</p>
          <p className="text-xs text-cream/40">{r.customer_email}</p>
        </div>
      ),
    },
    {
      key: 'rating', label: 'Rating', sortable: true,
      render: (r) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={12} className={i < r.rating ? 'fill-gold text-gold' : 'text-white/15'} />
          ))}
        </div>
      ),
    },
    { key: 'title', label: 'Title', render: (r) => <span className="text-cream/70 text-xs">{r.title ?? 'Untitled'}</span> },
    { key: 'comment', label: 'Comment', render: (r) => <span className="text-cream/60 text-xs">{r.comment ?? '—'}</span> },
    { key: 'created_at', label: 'Date', sortable: true, render: (r) => new Date(r.created_at).toLocaleDateString() },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Reviews" subtitle={isLoading ? 'Loading...' : `${reviews.length} customer reviews`} />

      <div className="glass rounded-lg p-6">
        <DataTable
          data={reviews}
          columns={columns}
          searchKeys={['product_name', 'product_slug', 'customer_name', 'customer_email', 'title', 'comment', 'status']}
          searchPlaceholder="Search reviews..."
          emptyMessage={isLoading ? 'Loading...' : 'No reviews found'}
          actions={(item) => (
            <div className="flex items-center justify-end gap-2">
              {item.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleApprove(item)}
                    className="text-cream/40 hover:text-green-400"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleReject(item)}
                    className="text-cream/40 hover:text-red-400"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
