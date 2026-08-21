<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function salesSummary(): array
    {
        $paidOrders = Order::query();

        return [
            'total_orders' => (clone $paidOrders)->count(),
            'total_revenue' => (float) (clone $paidOrders)->sum('total'),
            'average_order_value' => (float) round((clone $paidOrders)->avg('total') ?? 0, 2),
            'orders_by_status' => (clone $paidOrders)
                ->select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status'),
        ];
    }

    public function topProducts(int $limit = 5): array
    {
        return DB::table('order_items')
            ->select('product_name', DB::raw('SUM(quantity) as total_sold'), DB::raw('SUM(price * quantity) as total_revenue'))
            ->groupBy('product_name')
            ->orderByDesc('total_sold')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function lowStockProducts(int $threshold = 5)
    {
        return Product::where('stock_quantity', '<=', $threshold)
            ->where('is_published', true)
            ->orderBy('stock_quantity')
            ->get(['id', 'name', 'stock_quantity']);
    }
}