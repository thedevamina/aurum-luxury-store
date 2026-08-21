<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCouponRequest;
use App\Http\Requests\Admin\UpdateCouponRequest;
use App\Models\Coupon;
use App\Services\CouponService;

class AdminCouponController extends Controller
{
    public function __construct(protected CouponService $couponService)
    {
    }

    public function index()
    {
        return $this->couponService->list();
    }

    public function store(StoreCouponRequest $request)
    {
        return $this->couponService->create($request->validated());
    }

    public function update(UpdateCouponRequest $request, Coupon $coupon)
    {
        return $this->couponService->update($coupon, $request->validated());
    }

    public function destroy(Coupon $coupon)
    {
        $this->couponService->delete($coupon);

        return response()->json(['message' => 'Coupon deleted successfully.']);
    }
}