<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

interface ReviewRepositoryInterface
{
    public function approvedForProduct(Product $product): Collection;

    public function findByUserAndProduct(User $user, Product $product): ?Review;

    public function hasPurchased(User $user, Product $product): bool;

    public function create(array $data): Review;

    public function update(Review $review, array $data): Review;

    public function delete(Review $review): void;
}