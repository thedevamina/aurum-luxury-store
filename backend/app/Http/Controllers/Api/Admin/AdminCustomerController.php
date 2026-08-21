<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminCustomerDetailResource;
use App\Http\Resources\Admin\AdminCustomerResource;
use App\Models\User;

class AdminCustomerController extends Controller
{
    public function index()
    {
        $customers = User::role('customer')
            ->withCount('orders as order_count')
            ->withSum('orders as total_spent', 'total')
            ->latest()
            ->get();

        return AdminCustomerResource::collection($customers);
    }

    public function show(User $customer)
    {
        if (! $customer->hasRole('customer')) {
            abort(404, 'Customer not found.');
        }

        $customer->loadCount('orders as order_count')->loadSum('orders as total_spent', 'total');
        $customer->load(['orders' => fn ($query) => $query->with(['items', 'user:id,name,email'])->latest()]);

        return new AdminCustomerDetailResource($customer);
    }
}