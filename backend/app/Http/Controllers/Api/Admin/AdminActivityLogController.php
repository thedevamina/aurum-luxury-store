<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogService;

class AdminActivityLogController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index()
    {
        return $this->activityLogService->list();
    }
}