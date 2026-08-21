<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('brand')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('original_price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('details')->nullable();
            $table->json('images')->nullable();
            $table->json('colors')->nullable();
            $table->json('sizes')->nullable();
            $table->string('badge')->nullable();
            $table->boolean('in_stock')->default(true);
            $table->unsignedInteger('stock_quantity')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();

            $table->index(['category_id', 'is_published']);
            $table->fullText(['name', 'brand', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};