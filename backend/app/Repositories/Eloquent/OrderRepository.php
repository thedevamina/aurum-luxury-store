<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderRepository implements OrderRepositoryInterface
{
    public function create(array $orderData, array $items): Order
    {
        return DB::transaction(function () use ($orderData, $items) {
            $order = Order::create($orderData);

            foreach ($items as $item) {
                // Lock the product row so no other concurrent checkout can read/modify
                // its stock until THIS transaction commits or rolls back.
                $product = Product::where('id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $product || $product->stock_quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'stock' => "Insufficient stock for {$item['product_name']}.",
                    ]);
                }

                $product->decrement('stock_quantity', $item['quantity']);

                if ($product->stock_quantity <= 0) {
                    $product->update(['in_stock' => false]);
                }

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'color' => $item['color'],
                    'size' => $item['size'],
                    'quantity' => $item['quantity'],
                ]);
            }

            return $order->load('items');
        });
    }

    public function forUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Order::where('user_id', $user->id)
            ->with('items')
            ->latest()
            ->paginate($perPage);
    }

    public function findForUser(User $user, string $orderNumber): ?Order
    {
        return Order::where('user_id', $user->id)
            ->where('order_number', $orderNumber)
            ->with('items')
            ->first();
    }

    public function allForAdmin(int $perPage = 20): LengthAwarePaginator
{
    return Order::with(['items', 'user:id,name,email'])->latest()->paginate($perPage);
}

public function findByOrderNumberForAdmin(string $orderNumber): ?Order
{
    return Order::with(['items', 'user:id,name,email'])
        ->where('order_number', $orderNumber)
        ->first();
}

public function updateStatus(Order $order, string $status): Order
{
    $order->update(['status' => $status]);

    return $order->fresh(['items', 'user:id,name,email']);
}
}