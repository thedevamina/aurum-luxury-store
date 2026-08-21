<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Services\ContactMessageService;

class AdminContactMessageController extends Controller
{
    public function __construct(protected ContactMessageService $contactMessageService)
    {
    }

    public function index()
    {
        return $this->contactMessageService->list();
    }

    public function markAsRead(ContactMessage $contactMessage)
    {
        $this->contactMessageService->markAsRead($contactMessage);

        return response()->json(['message' => 'Marked as read.']);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $this->contactMessageService->delete($contactMessage);

        return response()->json(['message' => 'Message deleted.']);
    }
}