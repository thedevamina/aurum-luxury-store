<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStaffRequest;
use App\Http\Resources\Admin\AdminStaffResource;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminStaffController extends Controller
{
    public function index()
    {
        return AdminStaffResource::collection(
            User::role('staff')->latest()->get()
        );
    }

    public function store(StoreStaffRequest $request)
    {
        $staff = DB::transaction(function () use ($request) {
            $staff = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => Hash::make($request->validated('password')),
            ]);

            $staff->assignRole('staff');

            return $staff;
        });

        return new AdminStaffResource($staff);
    }

    public function destroy(User $staff)
    {
        if ($staff->id === auth()->id()) {
            abort(403, 'You cannot remove your own account.');
        }

        if (! $staff->hasRole('staff') || $staff->hasRole('admin')) {
            abort(403, 'Only staff accounts can be managed here.');
        }

        $staff->delete();

        return response()->json(['message' => 'Staff member removed successfully.']);
    }
}