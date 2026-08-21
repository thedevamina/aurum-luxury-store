<?php

namespace App\Repositories\Contracts;

use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface OrderRepositoryInterface
{
    public function create(array $orderData, array $items): Order;

    public function forUser(User $user, int $perPage = 10): LengthAwarePaginator;

    public function findForUser(User $user, string $orderNumber): ?Order;

    public function allForAdmin(int $perPage = 20): \Illuminate\Contracts\Pagination\LengthAwarePaginator;

public function findByOrderNumberForAdmin(string $orderNumber): ?Order;

public function updateStatus(Order $order, string $status): Order;
}