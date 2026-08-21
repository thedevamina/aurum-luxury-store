<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

   public function store(CheckoutRequest $request)
{
    $order = $this->orderService->checkout(
        $request->user(),
        $request->safe()->except('coupon_code'),
        $request->validated('coupon_code'),
    );

    return new OrderResource($order);
}

    public function index(Request $request)
    {
        return OrderResource::collection($this->orderService->list($request->user()));
    }

    public function show(Request $request, string $orderNumber)
    {
        return new OrderResource($this->orderService->find($request->user(), $orderNumber));
    }
}