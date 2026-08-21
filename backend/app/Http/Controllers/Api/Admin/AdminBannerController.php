<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBannerRequest;
use App\Http\Requests\Admin\UpdateBannerRequest;
use App\Models\Banner;
use App\Services\BannerService;

class AdminBannerController extends Controller
{
    public function __construct(protected BannerService $bannerService)
    {
    }

    public function index()
    {
        return $this->bannerService->list();
    }

    public function store(StoreBannerRequest $request)
    {
        return $this->bannerService->create($request->safe()->except('image'), $request->file('image'));
    }

    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        return $this->bannerService->update($banner, $request->safe()->except('image'), $request->file('image'));
    }

    public function destroy(Banner $banner)
    {
        $this->bannerService->delete($banner);

        return response()->json(['message' => 'Banner deleted successfully.']);
    }
}