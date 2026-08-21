<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_name' => $this->whenLoaded('product', fn () => $this->product->name),
            'product_slug' => $this->whenLoaded('product', fn () => $this->product->slug),
            'customer_name' => $this->whenLoaded('user', fn () => $this->user->name),
            'customer_email' => $this->whenLoaded('user', fn () => $this->user->email),
            'rating' => (int) $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'is_approved' => (bool) $this->is_approved,
            'status' => $this->is_approved ? 'Approved' : 'Pending',
            'created_at' => $this->created_at,
        ];
    }
}