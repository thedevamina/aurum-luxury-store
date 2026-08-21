<?php

namespace App\Services;

use App\Models\Coupon;
use App\Repositories\Contracts\CouponRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class CouponService
{
    public function __construct(protected CouponRepositoryInterface $coupons)
    {
    }

    public function list(): LengthAwarePaginator
    {
        return $this->coupons->paginate();
    }

    public function create(array $data): Coupon
    {
        return $this->coupons->create($data);
    }

    public function update(Coupon $coupon, array $data): Coupon
    {
        return $this->coupons->update($coupon, $data);
    }

    public function delete(Coupon $coupon): void
    {
        $this->coupons->delete($coupon);
    }

    /**
     * Validate a coupon code for preview purposes (e.g. showing the discount
     * in the cart before checkout). This does NOT lock or redeem it — that
     * only happens inside the actual checkout transaction.
     */
    public function preview(string $code, float $subtotal): array
    {
        $coupon = $this->coupons->findByCode(strtoupper(trim($code)));

        if (! $coupon || ! $coupon->isValid($subtotal)) {
            throw ValidationException::withMessages([
                'code' => 'This coupon code is invalid or has expired.',
            ]);
        }

        return [
            'code' => $coupon->code,
            'discount' => $coupon->calculateDiscount($subtotal),
        ];
    }
}