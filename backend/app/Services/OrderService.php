<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\CouponRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    protected const FLAT_SHIPPING_COST = 15.00;
    protected const FREE_SHIPPING_THRESHOLD = 500.00;

    public function __construct(
        protected OrderRepositoryInterface $orders,
        protected CartRepositoryInterface $carts,
        protected CouponRepositoryInterface $coupons,
    ) {
    }

    public function checkout(User $user, array $shippingDetails, ?string $couponCode = null): Order
    {
        $cart = $this->carts->forUser($user);

        if ($cart->items->isEmpty()) {
            throw ValidationException::withMessages([
                'cart' => 'Your cart is empty.',
            ]);
        }

        $subtotal = $cart->items->sum(fn ($item) => $item->product->price * $item->quantity);

        return DB::transaction(function () use ($user, $shippingDetails, $couponCode, $cart, $subtotal) {
            $discount = 0;
            $appliedCouponCode = null;

            if ($couponCode) {
                // Lock the coupon row for the duration of this transaction —
                // prevents two simultaneous checkouts from both redeeming
                // the last available use of the same coupon.
                $coupon = $this->coupons->findByCodeForUpdate(strtoupper(trim($couponCode)));

                if (! $coupon || ! $coupon->isValid((float) $subtotal)) {
                    throw ValidationException::withMessages([
                        'coupon_code' => 'This coupon code is invalid or has expired.',
                    ]);
                }

                $discount = $coupon->calculateDiscount((float) $subtotal);
                $appliedCouponCode = $coupon->code;

                $this->coupons->incrementUsage($coupon);
            }

            $shippingCost = ($subtotal - $discount) >= self::FREE_SHIPPING_THRESHOLD ? 0 : self::FLAT_SHIPPING_COST;
            $total = max(0, $subtotal - $discount) + $shippingCost;

            $orderData = array_merge($shippingDetails, [
                'order_number' => $this->generateOrderNumber(),
                'user_id' => $user->id,
                'status' => 'pending',
                'subtotal' => round($subtotal, 2),
                'shipping_cost' => $shippingCost,
                'coupon_code' => $appliedCouponCode,
                'discount_amount' => $discount,
                'total' => round($total, 2),
            ]);

            $items = $cart->items->map(fn ($item) => [
                'product_id' => $item->product_id,
                'product_name' => $item->product->name,
                'color' => $item->color,
                'size' => $item->size,
                'quantity' => $item->quantity,
            ])->toArray();

            $order = $this->orders->create($orderData, $items);

            $this->carts->clear($cart);

            return $order;
        });
    }

    public function list(User $user): LengthAwarePaginator
    {
        return $this->orders->forUser($user);
    }

    public function find(User $user, string $orderNumber): Order
    {
        $order = $this->orders->findForUser($user, $orderNumber);

        if (! $order) {
            abort(404, 'Order not found.');
        }

        return $order;
    }

    protected function generateOrderNumber(): string
    {
        return 'ORD-'.now()->format('Y').'-'.strtoupper(Str::random(8));
    }
    protected const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

public function listAllForAdmin(int $perPage = 20): \Illuminate\Contracts\Pagination\LengthAwarePaginator
{
    return $this->orders->allForAdmin($perPage);
}

public function findForAdmin(string $orderNumber): Order
{
    $order = $this->orders->findByOrderNumberForAdmin($orderNumber);

    if (! $order) {
        abort(404, 'Order not found.');
    }

    return $order;
}

public function updateStatus(string $orderNumber, string $status): Order
{
    if (! in_array($status, self::VALID_STATUSES, true)) {
        abort(422, 'Invalid order status.');
    }

    $order = $this->findForAdmin($orderNumber);

    return $this->orders->updateStatus($order, $status);
}
}