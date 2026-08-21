<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cache')->truncate();

        /*
        |--------------------------------------------------------------------------
        | Permissions
        |--------------------------------------------------------------------------
        */

        $permissions = [
            // Dashboard
            'dashboard.view',

            // Products
            'products.view',
            'products.create',
            'products.update',
            'products.delete',

            // Categories
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // Orders
            'orders.view',
            'orders.update_status',
            'orders.delete',

            // Customers
            'customers.view',
            'customers.update',
            'customers.delete',

            // Reviews
            'reviews.view',
            'reviews.approve',
            'reviews.delete',

            // Coupons
            'coupons.view',
            'coupons.create',
            'coupons.update',
            'coupons.delete',

            // Banners
            'banners.view',
            'banners.create',
            'banners.update',
            'banners.delete',

            // Staff
            'staff.view',
            'staff.create',
            'staff.update',
            'staff.delete',

            // Roles & Permissions
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',
            'roles.assign_permissions',

            // Reports
            'reports.view',
            'reports.export',

            // Contact Messages
            'contact_messages.view',
            'contact_messages.update',
            'contact_messages.delete',

            // Activity Logs
            'activity_logs.view',

            // Shipping
            'shipping.view',
            'shipping.create',
            'shipping.update',
            'shipping.delete',

            // Payments
            'payments.view',
            'payments.update',

            // Notifications
            'notifications.view',
            'notifications.create',
            'notifications.delete',

            // Settings
            'settings.view',
            'settings.update',

            // Media
            'media.view',
            'media.create',
            'media.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | Protected Admin Role
        |--------------------------------------------------------------------------
        */

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $admin->syncPermissions($permissions);

        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        */

        $superAdmin = Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        $superAdmin->syncPermissions(
            collect($permissions)
                ->reject(fn ($permission) => str_starts_with($permission, 'roles.'))
                ->values()
                ->all()
        );

        /*
        |--------------------------------------------------------------------------
        | Store Manager
        |--------------------------------------------------------------------------
        */

        $storeManager = Role::firstOrCreate([
            'name' => 'store-manager',
            'guard_name' => 'web',
        ]);

        $storeManager->syncPermissions([
            'dashboard.view',

            'products.view',
            'products.create',
            'products.update',
            'products.delete',

            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            'orders.view',
            'orders.update_status',

            'customers.view',
            'customers.update',

            'coupons.view',
            'coupons.create',
            'coupons.update',

            'banners.view',
            'banners.create',
            'banners.update',

            'reports.view',
            'reports.export',

            'contact_messages.view',
            'contact_messages.update',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Content Editor
        |--------------------------------------------------------------------------
        */

        $contentEditor = Role::firstOrCreate([
            'name' => 'content-editor',
            'guard_name' => 'web',
        ]);

        $contentEditor->syncPermissions([
            'dashboard.view',

            'products.view',
            'products.update',

            'categories.view',
            'categories.update',

            'banners.view',
            'banners.create',
            'banners.update',
            'banners.delete',

            'media.view',
            'media.create',
            'media.delete',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Customer Support
        |--------------------------------------------------------------------------
        */

        $customerSupport = Role::firstOrCreate([
            'name' => 'customer-support',
            'guard_name' => 'web',
        ]);

        $customerSupport->syncPermissions([
            'dashboard.view',

            'customers.view',
            'customers.update',

            'orders.view',
            'orders.update_status',

            'reviews.view',

            'contact_messages.view',
            'contact_messages.update',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Inventory Manager
        |--------------------------------------------------------------------------
        */

        $inventoryManager = Role::firstOrCreate([
            'name' => 'inventory-manager',
            'guard_name' => 'web',
        ]);

        $inventoryManager->syncPermissions([
            'dashboard.view',

            'products.view',
            'products.create',
            'products.update',

            'categories.view',

            'orders.view',

            'reports.view',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Existing Staff Role
        |--------------------------------------------------------------------------
        */

        $staff = Role::firstOrCreate([
            'name' => 'staff',
            'guard_name' => 'web',
        ]);

        $staff->syncPermissions([
            'dashboard.view',

            'products.view',
            'products.create',
            'products.update',

            'orders.view',
            'orders.update_status',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Customer Role
        |--------------------------------------------------------------------------
        */

        Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);
    }
}
