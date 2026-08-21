<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'brand',
        'price',
        'original_price',
        'description',
        'details',
        'images',
        'colors',
        'sizes',
        'badge',
        'in_stock',
        'stock_quantity',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'original_price' => 'decimal:2',
            'details' => 'array',
            'images' => 'array',
            'colors' => 'array',
            'sizes' => 'array',
            'in_stock' => 'boolean',
            'is_published' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(Review::class);
}
}