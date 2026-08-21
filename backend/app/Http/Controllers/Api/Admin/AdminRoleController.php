<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Http\Resources\Admin\AdminPermissionResource;
use App\Http\Resources\Admin\AdminRoleResource;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminRoleController extends Controller
{
    /**
     * Roles tied to core auth/authorisation behaviour elsewhere in the app
     * (AdminStaffController assigns 'staff' by exact name, registration
     * assigns 'customer' by exact name, etc). These can never be renamed
     * or deleted from this screen, even though 'super-admin' may still
     * have its permission set edited.
     */
    private const SYSTEM_ROLE_NAMES = ['admin', 'super-admin', 'staff', 'customer'];

    /**
     * Fully locked roles: no name change, no permission change, no delete.
     */
    private const FULLY_PROTECTED_ROLE_NAMES = ['admin'];

    /**
     * Hidden from this screen entirely. Every shopper gets this role
     * automatically on register — it isn't something an admin assigns
     * or manages from the Roles & Permissions page.
     */
    private const HIDDEN_ROLE_NAMES = ['customer'];

    public function index()
    {
        $roles = Role::with('permissions')
            ->whereNotIn('name', self::HIDDEN_ROLE_NAMES)
            ->orderBy('name')
            ->get();

        return AdminRoleResource::collection($roles);
    }

    public function permissions()
    {
        return AdminPermissionResource::collection(
            Permission::orderBy('name')->get()
        );
    }

    public function store(StoreRoleRequest $request)
    {
        $validated = $request->validated();

        if (in_array($validated['name'], self::SYSTEM_ROLE_NAMES, true)) {
            abort(422, 'That role name is reserved.');
        }

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);
        $role->load('permissions');

        return response()->json([
            'message' => 'Role created successfully.',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
        ], 201);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        if (in_array($role->name, self::FULLY_PROTECTED_ROLE_NAMES, true)) {
            abort(403, 'The Admin role is protected and cannot be changed.');
        }

        $validated = $request->validated();

        if (in_array($role->name, self::SYSTEM_ROLE_NAMES, true) && $validated['name'] !== $role->name) {
            abort(422, 'This role cannot be renamed because other parts of the app depend on its exact name.');
        }

        if (! in_array($role->name, self::SYSTEM_ROLE_NAMES, true)) {
            $role->name = $validated['name'];
            $role->save();
        }

        $role->syncPermissions($validated['permissions'] ?? []);
        $role->load('permissions');

        return response()->json([
            'message' => 'Role updated successfully.',
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
        ]);
    }

    public function destroy(Role $role)
    {
        if (in_array($role->name, self::SYSTEM_ROLE_NAMES, true)) {
            abort(403, 'This role is protected and cannot be deleted.');
        }

        if (User::role($role->name)->count() > 0) {
            abort(422, 'This role cannot be deleted while users are assigned to it.');
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully.']);
    }
}
