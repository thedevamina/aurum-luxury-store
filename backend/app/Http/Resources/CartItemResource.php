<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'color' => $this->color,
            'size' => $this->size,
            'product' => new ProductResource($this->whenLoaded('product')),
            'line_total' => $this->whenLoaded('product', fn () => round($this->product->price * $this->quantity, 2)),
        ];
    }
}