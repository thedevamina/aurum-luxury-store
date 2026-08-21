<?php
use App\Http\Controllers\Api\Admin\AdminActivityLogController;
use App\Http\Controllers\Api\Admin\AdminBannerController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
use App\Http\Controllers\Api\Admin\AdminCouponController;
use App\Http\Controllers\Api\Admin\AdminCustomerController;
use App\Http\Controllers\Api\Admin\AdminReviewController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminStaffController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\Admin\AdminContactMessageController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\Admin\AdminReportController;
use App\Http\Controllers\Api\Admin\AdminOrderController;

use App\Http\Controllers\Api\Admin\AdminRoleController;
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/contact', [ContactMessageController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::patch('/cart/items/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/items/{itemId}', [CartController::class, 'destroy']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    Route::post('/checkout', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);

    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::patch('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);
});

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/search', [ProductController::class, 'search']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/banners', [BannerController::class, 'index']);
    Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:admin,staff'])->prefix('admin')->group(function () {
    Route::get('/products', [AdminProductController::class, 'index']);
    Route::post('/products', [AdminProductController::class, 'store']);
    Route::post('/products/{product}', [AdminProductController::class, 'update']);
    Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);

    Route::get('/categories', [AdminCategoryController::class, 'index']);
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::post('/categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

    Route::get('/coupons', [AdminCouponController::class, 'index']);
    Route::post('/coupons', [AdminCouponController::class, 'store']);
    Route::patch('/coupons/{coupon}', [AdminCouponController::class, 'update']);
    Route::delete('/coupons/{coupon}', [AdminCouponController::class, 'destroy']);

    Route::get('/banners', [AdminBannerController::class, 'index']);
    Route::post('/banners', [AdminBannerController::class, 'store']);
    Route::post('/banners/{banner}', [AdminBannerController::class, 'update']);
    Route::delete('/banners/{banner}', [AdminBannerController::class, 'destroy']);
    Route::get('/contact-messages', [AdminContactMessageController::class, 'index']);
Route::patch('/contact-messages/{contactMessage}/read', [AdminContactMessageController::class, 'markAsRead']);
Route::delete('/contact-messages/{contactMessage}', [AdminContactMessageController::class, 'destroy']);

Route::middleware('role:admin')->group(function () {
Route::get('/staff', [AdminStaffController::class, 'index']);
Route::post('/staff', [AdminStaffController::class, 'store']);
Route::delete('/staff/{staff}', [AdminStaffController::class, 'destroy']);

});

Route::get('/customers', [AdminCustomerController::class, 'index']);
Route::get('/customers/{customer}', [AdminCustomerController::class, 'show']);

Route::get('/reviews', [AdminReviewController::class, 'index']);
Route::patch('/reviews/{review}/approve', [AdminReviewController::class, 'approve']);
Route::delete('/reviews/{review}', [AdminReviewController::class, 'reject']);

Route::get('/orders', [AdminOrderController::class, 'index']);
Route::get('/orders/{orderNumber}', [AdminOrderController::class, 'show']);
Route::patch('/orders/{orderNumber}/status', [AdminOrderController::class, 'updateStatus']);



Route::get('/activity-logs', [AdminActivityLogController::class, 'index']);


Route::get('/reports/sales', [AdminReportController::class, 'sales']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {

    // Roles & Permissions
    Route::get('/roles', [AdminRoleController::class, 'index']);
    Route::post('/roles', [AdminRoleController::class, 'store']);
    Route::patch('/roles/{role}', [AdminRoleController::class, 'update']);
    Route::delete('/roles/{role}', [AdminRoleController::class, 'destroy']);

    Route::get('/permissions', [AdminRoleController::class, 'permissions']);

});