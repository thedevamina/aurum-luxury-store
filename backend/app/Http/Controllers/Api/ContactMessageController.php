<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Services\ContactMessageService;

class ContactMessageController extends Controller
{
    public function __construct(protected ContactMessageService $contactMessageService)
    {
    }

    public function store(StoreContactMessageRequest $request)
    {
        $this->contactMessageService->submit($request->validated(), $request->ip());

        return response()->json(['message' => 'Your message has been sent successfully.']);
    }
}