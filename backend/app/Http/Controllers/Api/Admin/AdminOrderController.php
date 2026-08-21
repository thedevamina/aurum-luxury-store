<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\Admin\AdminOrderResource;
use App\Services\OrderService;

class AdminOrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    public function index()
    {
        return AdminOrderResource::collection($this->orderService->listAllForAdmin());
    }

    public function show(string $orderNumber)
    {
        return new AdminOrderResource($this->orderService->findForAdmin($orderNumber));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, string $orderNumber)
    {
        $order = $this->orderService->updateStatus($orderNumber, $request->validated('status'));

        return new AdminOrderResource($order);
    }
}