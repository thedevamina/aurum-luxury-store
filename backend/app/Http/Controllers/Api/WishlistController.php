<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Services\WishlistService;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function __construct(protected WishlistService $wishlistService)
    {
    }

    public function index(Request $request)
    {
        $items = $this->wishlistService->list($request->user());

        return ProductResource::collection($items->pluck('product'));
    }

    public function store(Request $request)
    {
        $request->validate(['product_id' => ['required', 'integer', 'min:1']]);

        $items = $this->wishlistService->addItem($request->user(), $request->input('product_id'));

        return ProductResource::collection($items->pluck('product'));
    }

    public function destroy(Request $request, int $productId)
    {
        $items = $this->wishlistService->removeItem($request->user(), $productId);

        return ProductResource::collection($items->pluck('product'));
    }
}