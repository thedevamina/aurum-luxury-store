<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\User;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Validation\ValidationException;

class CartService
{
    protected const MAX_QUANTITY_PER_ITEM = 10;

    public function __construct(
        protected CartRepositoryInterface $carts,
        protected ProductRepositoryInterface $products,
    ) {
    }

    public function getCart(User $user): Cart
    {
        return $this->carts->forUser($user);
    }

    public function addItem(User $user, int $productId, ?string $color, ?string $size, int $quantity): Cart
    {
        $this->assertValidQuantity($quantity);

        $product = $this->products->findPublishedById($productId);

        if (! $product) {
            abort(404, 'Product not found.');
        }

        if (! $product->in_stock) {
            throw ValidationException::withMessages([
                'product_id' => 'This product is currently out of stock.',
            ]);
        }

        $cart = $this->carts->forUser($user);
        $this->carts->addItem($cart, $product->id, $color, $size, $quantity);

        return $this->carts->forUser($user);
    }

    public function updateItem(User $user, int $itemId, int $quantity): Cart
    {
        $this->assertValidQuantity($quantity);

        $cart = $this->carts->forUser($user);

        if (! $this->carts->updateItemQuantity($cart, $itemId, $quantity)) {
            abort(404, 'Cart item not found.');
        }

        return $this->carts->forUser($user);
    }

    public function removeItem(User $user, int $itemId): Cart
    {
        $cart = $this->carts->forUser($user);

        if (! $this->carts->removeItem($cart, $itemId)) {
            abort(404, 'Cart item not found.');
        }

        return $this->carts->forUser($user);
    }

    protected function assertValidQuantity(int $quantity): void
    {
        if ($quantity < 1 || $quantity > self::MAX_QUANTITY_PER_ITEM) {
            throw ValidationException::withMessages([
                'quantity' => 'Quantity must be between 1 and '.self::MAX_QUANTITY_PER_ITEM.'.',
            ]);
        }
    }
}