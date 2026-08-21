<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number' => $this->order_number,
            'status' => $this->status,
            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'coupon_code' => $this->coupon_code,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total,
            'customer' => [
                'name' => $this->whenLoaded('user', fn () => $this->user->name),
                'email' => $this->whenLoaded('user', fn () => $this->user->email),
            ],
            'shipping' => [
                'name' => $this->shipping_name,
                'address_line1' => $this->shipping_address_line1,
                'address_line2' => $this->shipping_address_line2,
                'city' => $this->shipping_city,
                'postal_code' => $this->shipping_postal_code,
                'country' => $this->shipping_country,
                'phone' => $this->shipping_phone,
            ],
            'items' => $this->whenLoaded('items', fn () => $this->items->map(fn ($item) => [
                'id' => $item->id,
                'product_name' => $item->product_name,
                'price' => (float) $item->price,
                'color' => $item->color,
                'size' => $item->size,
                'quantity' => $item->quantity,
                'line_total' => round($item->price * $item->quantity, 2),
            ])),
            'created_at' => $this->created_at,
        ];
    }
}