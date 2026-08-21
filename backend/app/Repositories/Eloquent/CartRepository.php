<?php

namespace App\Repositories\Eloquent;

use App\Models\Cart;
use App\Models\User;
use App\Repositories\Contracts\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function forUser(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id])
            ->load('items.product');
    }

    public function addItem(Cart $cart, int $productId, ?string $color, ?string $size, int $quantity): void
    {
        $item = $cart->items()
            ->where('product_id', $productId)
            ->where('color', $color)
            ->where('size', $size)
            ->first();

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $cart->items()->create([
                'product_id' => $productId,
                'color' => $color,
                'size' => $size,
                'quantity' => $quantity,
            ]);
        }
    }

    public function updateItemQuantity(Cart $cart, int $itemId, int $quantity): bool
    {
        $item = $cart->items()->where('id', $itemId)->first();

        if (! $item) {
            return false;
        }

        $item->update(['quantity' => $quantity]);

        return true;
    }

    public function removeItem(Cart $cart, int $itemId): bool
    {
        return (bool) $cart->items()->where('id', $itemId)->delete();
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }
}