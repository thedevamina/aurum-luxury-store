<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Models\WishlistItem;
use App\Repositories\Contracts\WishlistRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WishlistRepository implements WishlistRepositoryInterface
{
    public function forUser(User $user): Collection
    {
        return $user->wishlistItems()->with('product')->get();
    }

    public function addItem(User $user, int $productId): void
    {
        WishlistItem::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);
    }

    public function removeItem(User $user, int $productId): bool
    {
        return (bool) $user->wishlistItems()->where('product_id', $productId)->delete();
    }

    public function isInWishlist(User $user, int $productId): bool
    {
        return $user->wishlistItems()->where('product_id', $productId)->exists();
    }
}