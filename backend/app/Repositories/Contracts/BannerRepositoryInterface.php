<?php

namespace App\Repositories\Contracts;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

interface BannerRepositoryInterface
{
    public function all(): Collection;

    public function active(): Collection;

    public function create(array $data): Banner;

    public function update(Banner $banner, array $data): Banner;

    public function delete(Banner $banner): void;
}