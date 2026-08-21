<?php

namespace App\Repositories\Contracts;

use App\Models\Cart;
use App\Models\User;

interface CartRepositoryInterface
{
    public function forUser(User $user): Cart;

    public function addItem(Cart $cart, int $productId, ?string $color, ?string $size, int $quantity): void;

    public function updateItemQuantity(Cart $cart, int $itemId, int $quantity): bool;

    public function removeItem(Cart $cart, int $itemId): bool;

    public function clear(Cart $cart): void;
}