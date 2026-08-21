<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminCustomerDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'customer' => [
                'id' => $this->id,
                'name' => $this->name,
                'email' => $this->email,
                'order_count' => (int) ($this->order_count ?? 0),
                'total_spent' => (float) ($this->total_spent ?? 0),
                'joined' => $this->created_at?->toDateString(),
            ],
            'orders' => AdminOrderResource::collection($this->whenLoaded('orders')),
        ];
    }
}