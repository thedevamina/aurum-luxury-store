<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface WishlistRepositoryInterface
{
    public function forUser(User $user): Collection;

    public function addItem(User $user, int $productId): void;

    public function removeItem(User $user, int $productId): bool;

    public function isInWishlist(User $user, int $productId): bool;
}