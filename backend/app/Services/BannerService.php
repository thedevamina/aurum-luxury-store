<?php

namespace App\Services;

use App\Models\Banner;
use App\Repositories\Contracts\BannerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerService
{
    public function __construct(protected BannerRepositoryInterface $banners)
    {
    }

    public function list(): Collection
    {
        return $this->banners->all();
    }

    public function listActive(): Collection
    {
        return $this->banners->active();
    }

    public function create(array $data, UploadedFile $image): Banner
    {
        $data['image'] = $this->storeImage($image);

        return $this->banners->create($data);
    }

    public function update(Banner $banner, array $data, ?UploadedFile $image = null): Banner
    {
        if ($image) {
            $this->deleteImage($banner->image);
            $data['image'] = $this->storeImage($image);
        }

        return $this->banners->update($banner, $data);
    }

    public function delete(Banner $banner): void
    {
        $this->deleteImage($banner->image);
        $this->banners->delete($banner);
    }

    protected function storeImage(UploadedFile $image): string
    {
        $filename = Str::uuid().'.'.$image->getClientOriginalExtension();
        $path = $image->storeAs('banners', $filename, 'public');

        return Storage::disk('public')->url($path);
    }

    protected function deleteImage(string $imageUrl): void
    {
        $path = 'banners/'.basename(parse_url($imageUrl, PHP_URL_PATH));
        Storage::disk('public')->delete($path);
    }
}