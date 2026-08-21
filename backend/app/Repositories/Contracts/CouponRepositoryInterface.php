<?php

namespace App\Repositories\Contracts;

use App\Models\Coupon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CouponRepositoryInterface
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function findByCode(string $code): ?Coupon;

    public function findByCodeForUpdate(string $code): ?Coupon;

    public function create(array $data): Coupon;

    public function update(Coupon $coupon, array $data): Coupon;

    public function delete(Coupon $coupon): void;

    public function incrementUsage(Coupon $coupon): void;
}