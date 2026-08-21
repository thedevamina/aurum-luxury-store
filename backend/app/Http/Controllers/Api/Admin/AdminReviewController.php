<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminReviewResource;
use App\Models\Review;

class AdminReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::with(['product:id,name,slug', 'user:id,name,email'])
            ->latest()
            ->get();

        return AdminReviewResource::collection($reviews);
    }

    public function approve(Review $review)
    {
        $review->update(['is_approved' => true]);

        return new AdminReviewResource($review->fresh(['product:id,name,slug', 'user:id,name,email']));
    }

    public function reject(Review $review)
    {
        $review->delete();

        return response()->json(['message' => 'Review rejected successfully.']);
    }
}