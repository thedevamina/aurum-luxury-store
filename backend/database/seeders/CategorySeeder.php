<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Watches', 'description' => 'Timeless precision crafted for the discerning.'],
            ['name' => 'Bags', 'description' => 'Handcrafted leather goods for every occasion.'],
            ['name' => 'Jewelry', 'description' => 'Exquisite pieces that tell your story.'],
            ['name' => 'Fragrance', 'description' => 'Signature scents that linger in memory.'],
            ['name' => 'Eyewear', 'description' => 'Optical excellence and bold statements.'],
            ['name' => 'Footwear', 'description' => 'Step into luxury with every stride.'],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
            ]);
        }
    }
}