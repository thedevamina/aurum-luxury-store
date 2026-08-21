<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddCartItemRequest;
use App\Http\Requests\Cart\UpdateCartItemRequest;
use App\Http\Resources\CartResource;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(protected CartService $cartService)
    {
    }

    public function index(Request $request)
    {
        return new CartResource($this->cartService->getCart($request->user()));
    }

    public function store(AddCartItemRequest $request)
    {
        $cart = $this->cartService->addItem(
            $request->user(),
            $request->validated('product_id'),
            $request->validated('color'),
            $request->validated('size'),
            $request->validated('quantity'),
        );

        return new CartResource($cart);
    }

    public function update(UpdateCartItemRequest $request, int $itemId)
    {
        $cart = $this->cartService->updateItem(
            $request->user(),
            $itemId,
            $request->validated('quantity'),
        );

        return new CartResource($cart);
    }

    public function destroy(Request $request, int $itemId)
    {
        $cart = $this->cartService->removeItem($request->user(), $itemId);

        return new CartResource($cart);
    }
}