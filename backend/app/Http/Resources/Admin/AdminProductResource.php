<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ],
            'name' => $this->name,
            'slug' => $this->slug,
            'brand' => $this->brand,
            'price' => (float) $this->price,
            'original_price' => $this->original_price ? (float) $this->original_price : null,
            'description' => $this->description,
            'details' => $this->details,
            'images' => $this->images,
            'colors' => $this->colors,
            'sizes' => $this->sizes,
            'badge' => $this->badge,
            'in_stock' => $this->in_stock,
            'stock_quantity' => $this->stock_quantity,
            'is_published' => $this->is_published,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}