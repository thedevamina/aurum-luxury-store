<?php

namespace App\Repositories\Eloquent;

use App\Models\ContactMessage;
use App\Repositories\Contracts\ContactMessageRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactMessageRepository implements ContactMessageRepositoryInterface
{
    public function create(array $data): ContactMessage
    {
        return ContactMessage::create($data);
    }

    public function paginate(int $perPage = 20): LengthAwarePaginator
    {
        return ContactMessage::latest()->paginate($perPage);
    }

    public function markAsRead(ContactMessage $message): void
    {
        $message->update(['is_read' => true]);
    }

    public function delete(ContactMessage $message): void
    {
        $message->delete();
    }
}