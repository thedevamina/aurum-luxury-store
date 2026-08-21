<?php

namespace App\Http\Resources\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminRoleResource extends JsonResource
{
    private const SYSTEM_ROLE_NAMES = ['admin', 'super-admin', 'staff', 'customer'];

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->descriptionFor($this->name),
            'users_count' => User::role($this->name)->count(),
            'permissions_count' => $this->whenLoaded(
                'permissions',
                fn () => $this->permissions->count(),
                0
            ),
            'permissions' => $this->whenLoaded(
                'permissions',
                fn () => $this->permissions->pluck('name')->values(),
                []
            ),
            'protected' => in_array($this->name, self::SYSTEM_ROLE_NAMES, true),
        ];
    }

    private function descriptionFor(string $name): string
    {
        return match ($name) {
            'admin' => 'Full access to every area of the store. Cannot be edited or removed.',
            'super-admin' => 'Full operational access without role-management permissions.',
            'staff' => 'Baseline staff account created from the Staff Management page.',
            'store-manager' => 'Manages catalogue, orders, coupons, banners, and reports.',
            'content-editor' => 'Manages product content, categories, banners, and media.',
            'customer-support' => 'Handles customer records, order status, and contact messages.',
            'inventory-manager' => 'Manages product stock, categories, and inventory reports.',
            default => 'Custom role.',
        };
    }
}
