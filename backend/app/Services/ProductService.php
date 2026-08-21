<?php

namespace App\Services;

use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
class ProductService
{
    protected const MAX_PER_PAGE = 48;
    protected const DEFAULT_PER_PAGE = 12;

    public function __construct(protected ProductRepositoryInterface $products)
    {
    }

    public function list(array $filters): LengthAwarePaginator
    {
        $perPage = $this->resolvePerPage($filters['per_page'] ?? null);

        return $this->products->paginate($filters, $perPage);
    }

    public function findBySlug(string $slug)
    {
        $product = $this->products->findBySlug($slug);

        if (! $product) {
            abort(404, 'Product not found.');
        }

        return $product;
    }

    public function search(string $query): LengthAwarePaginator
    {
        $query = trim($query);

        if (mb_strlen($query) < 2) {
            abort(422, 'Search query must be at least 2 characters.');
        }

        if (mb_strlen($query) > 100) {
            Log::warning('Unusually long search query received', ['length' => mb_strlen($query)]);
            $query = mb_substr($query, 0, 100);
        }

        return $this->products->search($query, self::DEFAULT_PER_PAGE);
    }

    protected function resolvePerPage(?int $requested): int
    {
        if (! $requested || $requested < 1) {
            return self::DEFAULT_PER_PAGE;
        }

        return min($requested, self::MAX_PER_PAGE);
    }

    public function create(array $data, array $images = []): Product
{
    $data['slug'] = $this->generateUniqueSlug($data['name']);
    $data['images'] = $this->storeImages($images);
    $data['in_stock'] = ($data['stock_quantity'] ?? 0) > 0;

    return $this->products->create($data);
}

public function update(Product $product, array $data, array $images = []): Product
{
    if (! empty($images)) {
        $this->deleteImages($product->images ?? []);
        $data['images'] = $this->storeImages($images);
    }

    if (isset($data['name']) && $data['name'] !== $product->name) {
        $data['slug'] = $this->generateUniqueSlug($data['name']);
    }

    if (isset($data['stock_quantity'])) {
        $data['in_stock'] = $data['stock_quantity'] > 0;
    }

    return $this->products->update($product, $data);
}

public function delete(Product $product): void
{
    $this->deleteImages($product->images ?? []);
    $this->products->delete($product);
}

protected function storeImages(array $images): array
{
    $paths = [];

    foreach ($images as $image) {
        if (! $image instanceof UploadedFile || ! $image->isValid()) {
            continue;
        }

        // Generate our own random filename — NEVER trust the client's
        // original filename or extension.
        $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
        $path = $image->storeAs('products', $filename, 'public');
        $paths[] = Storage::disk('public')->url($path);
    }

    return $paths;
}

protected function deleteImages(array $imageUrls): void
{
    foreach ($imageUrls as $url) {
        $path = 'products/'.basename(parse_url($url, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }
}

protected function generateUniqueSlug(string $name): string
{
    $slug = Str::slug($name);
    $original = $slug;
    $count = 1;

    while ($this->products->slugExists($slug)) {
        $slug = $original.'-'.$count++;
    }

    return $slug;
}
public function listForAdmin(array $filters)
{
    return $this->products->paginateForAdmin($filters, self::DEFAULT_PER_PAGE);
}
}