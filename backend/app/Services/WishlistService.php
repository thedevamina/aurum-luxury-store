<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\ProductRepositoryInterface;
use App\Repositories\Contracts\WishlistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WishlistService
{
    public function __construct(
        protected WishlistRepositoryInterface $wishlist,
        protected ProductRepositoryInterface $products,
    ) {
    }

    public function list(User $user): Collection
    {
        return $this->wishlist->forUser($user);
    }

    public function addItem(User $user, int $productId): Collection
    {
        $product = $this->products->findPublishedById($productId);

        if (! $product) {
            abort(404, 'Product not found.');
        }

        $this->wishlist->addItem($user, $productId);

        return $this->wishlist->forUser($user);
    }

    public function removeItem(User $user, int $productId): Collection
    {
        $this->wishlist->removeItem($user, $productId);

        return $this->wishlist->forUser($user);
    }
}