<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BannerService;

class BannerController extends Controller
{
    public function __construct(protected BannerService $bannerService)
    {
    }

    public function index()
    {
        return $this->bannerService->listActive();
    }
}