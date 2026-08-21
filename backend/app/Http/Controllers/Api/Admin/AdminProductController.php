<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Http\Resources\Admin\AdminProductResource;
use App\Models\Product;
use App\Services\ActivityLogService;
use App\Services\ProductService;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function __construct(
        protected ProductService $productService,
        protected ActivityLogService $activityLog,
    ) {
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category', 'sort', 'per_page']);

        return AdminProductResource::collection($this->productService->listForAdmin($filters));
    }

    public function store(StoreProductRequest $request)
    {
        $product = $this->productService->create(
            $request->safe()->except('images'),
            $request->file('images', []),
        );

        $this->activityLog->record($request->user(), 'product.created', $product);

        return new AdminProductResource($product->load('category'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $before = $product->only(['name', 'price', 'stock_quantity']);

        $product = $this->productService->update(
            $product,
            $request->safe()->except('images'),
            $request->file('images', []),
        );

        $this->activityLog->record($request->user(), 'product.updated', $product, [
            'before' => $before,
            'after' => $product->only(['name', 'price', 'stock_quantity']),
        ]);

        return new AdminProductResource($product->load('category'));
    }

    public function destroy(Product $product)
    {
        $productId = $product->id;
        $productName = $product->name;

        $this->productService->delete($product);

        $this->activityLog->record(
            auth()->user(),
            'product.deleted',
            (object) ['id' => $productId],
            ['name' => $productName]
        );

        return response()->json(['message' => 'Product deleted successfully.']);
    }
}