<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class ReviewService
{
    public function __construct(protected ReviewRepositoryInterface $reviews)
    {
    }

    public function listForProduct(Product $product): Collection
    {
        return $this->reviews->approvedForProduct($product);
    }

    public function create(User $user, Product $product, array $data): Review
    {
        if (! $this->reviews->hasPurchased($user, $product)) {
            throw ValidationException::withMessages([
                'product' => 'You can only review products you have purchased.',
            ]);
        }

        if ($this->reviews->findByUserAndProduct($user, $product)) {
            throw ValidationException::withMessages([
                'product' => 'You have already reviewed this product.',
            ]);
        }

        return $this->reviews->create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'comment' => $data['comment'] ?? null,
        ]);
    }

    public function update(User $user, Review $review, array $data): Review
    {
        $this->authorizeOwnership($user, $review);

        return $this->reviews->update($review, [
            'rating' => $data['rating'] ?? $review->rating,
            'title' => $data['title'] ?? $review->title,
            'comment' => $data['comment'] ?? $review->comment,
            'is_approved' => false, // edited reviews must be re-moderated
        ]);
    }

    public function delete(User $user, Review $review): void
    {
        $this->authorizeOwnership($user, $review);

        $this->reviews->delete($review);
    }

    protected function authorizeOwnership(User $user, Review $review): void
    {
        if ($review->user_id !== $user->id) {
            abort(403, 'You can only manage your own reviews.');
        }
    }
}