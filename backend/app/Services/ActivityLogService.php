<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Request;

class ActivityLogService
{
    public function record(User $user, string $action, ?object $subject = null, array $changes = []): void
    {
        ActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject->id ?? null,
            'changes' => $changes ?: null,
            'ip_address' => Request::ip(),
        ]);
    }

    public function list(int $perPage = 30): LengthAwarePaginator
    {
        return ActivityLog::with('user:id,name,email')->latest()->paginate($perPage);
    }
}