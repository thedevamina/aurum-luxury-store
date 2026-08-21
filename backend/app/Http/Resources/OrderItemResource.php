<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product_name,
            'price' => (float) $this->price,
            'color' => $this->color,
            'size' => $this->size,
            'quantity' => $this->quantity,
            'line_total' => round($this->price * $this->quantity, 2),
        ];
    }
}