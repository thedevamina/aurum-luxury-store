<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Aurum Chronograph', 'brand' => 'Maison Aurelle', 'category' => 'Watches',
                'price' => 2850, 'original_price' => 3400,
                'description' => 'A masterwork of horological engineering, the Aurum Chronograph features a Swiss automatic movement housed in 18k gold-plated stainless steel.',
                'details' => ['Swiss automatic movement', '18k gold-plated case', 'Sapphire crystal glass', '50m water resistance', 'Italian leather strap'],
                'images' => ['https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['Gold', 'Silver', 'Rose Gold'], 'sizes' => ['40mm', '42mm', '44mm'],
                'badge' => 'Bestseller', 'stock_quantity' => 25,
            ],
            [
                'name' => 'Noir Tote Bag', 'brand' => 'Velluto', 'category' => 'Bags',
                'price' => 1290, 'original_price' => null,
                'description' => 'Handcrafted from full-grain Italian calfskin, the Noir Tote is a statement of understated luxury and everyday functionality.',
                'details' => ['Full-grain Italian calfskin', 'Hand-stitched seams', 'Suede-lined interior', 'Gold-tone hardware', 'Dust bag included'],
                'images' => ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['Black', 'Cognac', 'Cream'], 'sizes' => ['Medium', 'Large'],
                'badge' => 'New', 'stock_quantity' => 18,
            ],
            [
                'name' => 'Étoile Diamond Ring', 'brand' => 'Lumière', 'category' => 'Jewelry',
                'price' => 4200, 'original_price' => null,
                'description' => 'A brilliant-cut solitaire diamond set in hand-polished platinum. The Étoile ring is an eternal symbol of refined love.',
                'details' => ['0.8ct brilliant-cut diamond', 'VS1 clarity', 'Platinum band', 'GIA certified', 'Lifetime warranty'],
                'images' => ['https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['Platinum', 'Rose Gold', 'White Gold'], 'sizes' => ['4', '5', '6', '7', '8'],
                'badge' => 'Exclusive', 'stock_quantity' => 5,
            ],
            [
                'name' => 'Ambre Noir Eau de Parfum', 'brand' => 'Maison Aurelle', 'category' => 'Fragrance',
                'price' => 320, 'original_price' => null,
                'description' => 'An intoxicating blend of amber, oud, and bergamot. Ambre Noir is a warm, sensual fragrance for the modern connoisseur.',
                'details' => ['100ml Eau de Parfum', 'Top: Bergamot, Saffron', 'Heart: Amber, Oud', 'Base: Sandalwood, Musk', 'Unisex'],
                'images' => ['https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['100ml', '50ml'], 'sizes' => [],
                'badge' => null, 'stock_quantity' => 40,
            ],
            [
                'name' => 'Aviateur Sunglasses', 'brand' => 'Lumière', 'category' => 'Eyewear',
                'price' => 480, 'original_price' => 620,
                'description' => 'Hand-finished acetate frames with polarized lenses. The Aviateur combines classic aviation style with modern luxury.',
                'details' => ['Italian acetate frame', 'Polarized UV400 lenses', 'Gold-tone bridge', 'Leather case included', 'Adjustable nose pads'],
                'images' => ['https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['Tortoise', 'Black', 'Crystal'], 'sizes' => ['One Size'],
                'badge' => null, 'stock_quantity' => 30,
            ],
            [
                'name' => 'Monaco Leather Loafers', 'brand' => 'Velluto', 'category' => 'Footwear',
                'price' => 890, 'original_price' => null,
                'description' => 'Penny loafers handcrafted from glazed Italian calf leather with a leather sole and cushioned insole for all-day comfort.',
                'details' => ['Glazed Italian calf leather', 'Leather sole', 'Cushioned insole', 'Goodyear welted', 'Made in Italy'],
                'images' => ['https://images.pexels.com/photos/2589653/pexels-photo-2589653.jpeg?auto=compress&cs=tinysrgb&w=900'],
                'colors' => ['Black', 'Burgundy', 'Cognac'], 'sizes' => ['40', '41', '42', '43', '44', '45'],
                'badge' => null, 'stock_quantity' => 22,
            ],
        ];

        foreach ($products as $product) {
            $category = Category::where('name', $product['category'])->first();

            Product::create([
                'category_id' => $category->id,
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'brand' => $product['brand'],
                'price' => $product['price'],
                'original_price' => $product['original_price'],
                'description' => $product['description'],
                'details' => $product['details'],
                'images' => $product['images'],
                'colors' => $product['colors'],
                'sizes' => $product['sizes'],
                'badge' => $product['badge'],
                'in_stock' => $product['stock_quantity'] > 0,
                'stock_quantity' => $product['stock_quantity'],
                'is_published' => true,
            ]);
        }
    }
}