<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Repositories\Contracts\ReviewRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function approvedForProduct(Product $product): Collection
    {
        return $product->reviews()->approved()->with('user:id,name')->latest()->get();
    }

    public function findByUserAndProduct(User $user, Product $product): ?Review
    {
        return Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();
    }

    public function hasPurchased(User $user, Product $product): bool
    {
        return Order::where('user_id', $user->id)
            ->whereHas('items', fn ($q) => $q->where('product_id', $product->id))
            ->exists();
    }

    public function create(array $data): Review
    {
        return Review::create($data);
    }

    public function update(Review $review, array $data): Review
    {
        $review->update($data);

        return $review->fresh();
    }

    public function delete(Review $review): void
    {
        $review->delete();
    }
}