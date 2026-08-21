<?php

namespace App\Services;

use App\Models\ContactMessage;
use App\Repositories\Contracts\ContactMessageRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ContactMessageService
{
    public function __construct(protected ContactMessageRepositoryInterface $messages)
    {
    }

    public function submit(array $data, ?string $ip): ContactMessage
    {
        return $this->messages->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'subject' => $data['subject'],
            'message' => $data['message'],
            'ip_address' => $ip,
        ]);
    }

    public function list(): LengthAwarePaginator
    {
        return $this->messages->paginate();
    }

    public function markAsRead(ContactMessage $message): void
    {
        $this->messages->markAsRead($message);
    }

    public function delete(ContactMessage $message): void
    {
        $this->messages->delete($message);
    }
}