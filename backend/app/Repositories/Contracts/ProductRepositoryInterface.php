<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ProductRepositoryInterface
{
    public function paginate(array $filters, int $perPage = 12): LengthAwarePaginator;

    public function findBySlug(string $slug): ?Product;

    public function search(string $query, int $perPage = 12): LengthAwarePaginator;

    public function findPublishedById(int $id): ?Product;

    public function create(array $data): Product;

    public function update(Product $product, array $data): Product;

    public function delete(Product $product): void;

    public function slugExists(string $slug): bool;

    public function paginateForAdmin(array $filters, int $perPage = 12): LengthAwarePaginator;
}