<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository implements ProductRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::published()->with('category');

        if (! empty($filters['category'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        if (! empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (! empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (! empty($filters['sort'])) {
            match ($filters['sort']) {
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                'newest' => $query->orderBy('created_at', 'desc'),
                default => $query->orderBy('id', 'asc'),
            };
        }

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Product
    {
        return Product::published()->with('category')->where('slug', $slug)->first();
    }

    public function search(string $query, int $perPage = 12): LengthAwarePaginator
    {
        return Product::published()
            ->with('category')
            ->whereFullText(['name', 'brand', 'description'], $query)
            ->paginate($perPage);
    }

    public function findPublishedById(int $id): ?Product
    {
        return Product::published()->find($id);
    }

    public function create(array $data): Product
    {
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);

        return $product->fresh();
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }

    public function slugExists(string $slug): bool
    {
        return Product::where('slug', $slug)->exists();
    }

    public function paginateForAdmin(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::with('category');

        if (! empty($filters['category'])) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $filters['category']));
        }

        if (! empty($filters['sort'])) {
            match ($filters['sort']) {
                'price_asc' => $query->orderBy('price', 'asc'),
                'price_desc' => $query->orderBy('price', 'desc'),
                default => $query->orderBy('created_at', 'desc'),
            };
        }

        return $query->paginate($perPage);
    }
}