<?php

namespace App\Repositories\Eloquent;

use App\Models\Banner;
use App\Repositories\Contracts\BannerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BannerRepository implements BannerRepositoryInterface
{
    public function all(): Collection
    {
        return Banner::orderBy('sort_order')->get();
    }

    public function active(): Collection
    {
        return Banner::active()->orderBy('sort_order')->get();
    }

    public function create(array $data): Banner
    {
        return Banner::create($data);
    }

    public function update(Banner $banner, array $data): Banner
    {
        $banner->update($data);

        return $banner->fresh();
    }

    public function delete(Banner $banner): void
    {
        $banner->delete();
    }
}