<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(protected ReviewService $reviewService)
    {
    }

    public function index(Product $product)
    {
        return ReviewResource::collection($this->reviewService->listForProduct($product));
    }

    public function store(StoreReviewRequest $request, Product $product)
    {
        $review = $this->reviewService->create($request->user(), $product, $request->validated());

        return new ReviewResource($review);
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        $review = $this->reviewService->update($request->user(), $review, $request->validated());

        return new ReviewResource($review);
    }

    public function destroy(Request $request, Review $review)
    {
        $this->reviewService->delete($request->user(), $review);

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}