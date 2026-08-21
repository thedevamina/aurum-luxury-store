<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;

class AdminReportController extends Controller
{
    public function __construct(protected ReportService $reportService)
    {
    }

    public function sales()
    {
        return response()->json([
            'summary' => $this->reportService->salesSummary(),
            'top_products' => $this->reportService->topProducts(),
            'low_stock' => $this->reportService->lowStockProducts(),
        ]);
    }
}