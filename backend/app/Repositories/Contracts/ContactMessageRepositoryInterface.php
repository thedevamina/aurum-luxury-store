<?php

namespace App\Repositories\Contracts;

use App\Models\ContactMessage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface ContactMessageRepositoryInterface
{
    public function create(array $data): ContactMessage;

    public function paginate(int $perPage = 20): LengthAwarePaginator;

    public function markAsRead(ContactMessage $message): void;

    public function delete(ContactMessage $message): void;
}