<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(protected CategoryRepositoryInterface $categories)
    {
    }

    public function list(): Collection
    {
        return $this->categories->all();
    }

    public function create(array $data, ?UploadedFile $image = null): Category
    {
        $data['slug'] = $this->generateUniqueSlug($data['name']);

        if ($image) {
            $data['image'] = $this->storeImage($image);
        }

        return $this->categories->create($data);
    }

    public function update(Category $category, array $data, ?UploadedFile $image = null): Category
    {
        if ($image) {
            $this->deleteImage($category->image);
            $data['image'] = $this->storeImage($image);
        }

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        return $this->categories->update($category, $data);
    }

    public function delete(Category $category): void
    {
        if ($category->products()->exists()) {
            abort(422, 'Cannot delete a category that still has products assigned to it.');
        }

        $this->deleteImage($category->image);
        $this->categories->delete($category);
    }

    protected function storeImage(UploadedFile $image): string
    {
        $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
        $path = $image->storeAs('categories', $filename, 'public');

        return Storage::disk('public')->url($path);
    }

    protected function deleteImage(?string $imageUrl): void
    {
        if (! $imageUrl) {
            return;
        }

        $path = 'categories/'.basename(parse_url($imageUrl, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }

    protected function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while ($this->categories->slugExists($slug)) {
            $slug = $original.'-'.$count++;
        }

        return $slug;
    }
}