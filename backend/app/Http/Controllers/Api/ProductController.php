<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\SearchProductsRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService)
    {
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category', 'min_price', 'max_price', 'sort', 'per_page']);

        return ProductResource::collection($this->productService->list($filters));
    }

    public function show(string $slug)
    {
        return new ProductResource($this->productService->findBySlug($slug));
    }

    public function search(SearchProductsRequest $request)
    {
        return ProductResource::collection(
            $this->productService->search($request->validated('q'))
        );
    }
}