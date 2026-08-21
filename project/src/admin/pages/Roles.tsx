import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { PageHeader } from '@/admin/components/ui/AdminUI';
import Modal from '@/admin/components/ui/Modal';
import AdminButton from '@/admin/components/ui/AdminButton';
import { useToastContext } from '@/admin/context/ToastContext';
import { apiFetch, ApiError } from '@/lib/api';

interface Role {
  id: number;
  name: string;
  description: string;
  users_count: number;
  permissions_count: number;
  permissions: string[];
  protected: boolean;
}

interface Permission {
  id: number;
  name: string;
  guard_name: string;
}

interface RolesResponse {
  data: Role[];
}

interface PermissionsResponse {
  data: Permission[];
}

interface RoleResponse {
  message: string;
  data: {
    id: number;
    name: string;
    permissions: string[];
  };
}

function formatRoleName(name: string) {
  return name
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function slugifyRoleName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

function permissionLabel(permission: string) {
  const [, action] = permission.split('.');

  if (!action) {
    return formatRoleName(permission);
  }

  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function permissionGroup(permission: string) {
  const [group] = permission.split('.');

  return formatRoleName(group || 'Other');
}

export default function Roles() {
  const { show } = useToastContext();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Load Roles + Permissions
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [rolesResponse, permissionsResponse] = await Promise.all([
        apiFetch<RolesResponse>('/api/admin/roles'),
       apiFetch<PermissionsResponse>('/api/admin/permissions'),
      ]);

      setRoles(rolesResponse.data);
      setPermissions(permissionsResponse.data);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to load roles and permissions.';

      setError(message);
      show(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Permission Groups
  |--------------------------------------------------------------------------
  */

  const permissionGroups = useMemo(() => {
    const groups: Record<string, Permission[]> = {};


    permissions.forEach((permission) => {
      const group = permissionGroup(permission.name);

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(permission);
    });

    return Object.entries(groups).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [permissions]);

  /*
  |--------------------------------------------------------------------------
  | Modal Helpers
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleName('');
    setSelectedPermissions([]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setRoleName(formatRoleName(role.name));
    setSelectedPermissions(role.permissions);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingRole(null);
    setRoleName('');
    setSelectedPermissions([]);
    setError('');
  };

  /*
  |--------------------------------------------------------------------------
  | Permission Selection
  |--------------------------------------------------------------------------
  */

  const togglePermission = (permissionName: string) => {
    setSelectedPermissions((current) =>
      current.includes(permissionName)
        ? current.filter((permission) => permission !== permissionName)
        : [...current, permissionName]
    );
  };

  const toggleGroup = (groupPermissions: Permission[]) => {
    const names = groupPermissions.map((permission) => permission.name);

    const allSelected = names.every((name) =>
      selectedPermissions.includes(name)
    );

    if (allSelected) {
      setSelectedPermissions((current) =>
        current.filter((permission) => !names.includes(permission))
      );
    } else {
      setSelectedPermissions((current) =>
        Array.from(new Set([...current, ...names]))
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Create / Update Role
  |--------------------------------------------------------------------------
  */

  const saveRole = async () => {
    const normalizedName = slugifyRoleName(roleName);

    if (!normalizedName) {
      setError('Please enter a valid role name.');
      return;
    }

    if (normalizedName === 'admin') {
      setError('The Admin role is protected.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      if (editingRole) {
        await apiFetch<RoleResponse>(
          `/api/admin/roles/${editingRole.id}`
          ,
          {
            method: 'PATCH',
            body: JSON.stringify({
              name: normalizedName,
              permissions: selectedPermissions,
            }),
          }
        );

        show('Role updated successfully.');
      } else {
        await apiFetch<RoleResponse>('/api/admin/roles', {
          method: 'POST',
          body: JSON.stringify({
            name: normalizedName,
            permissions: selectedPermissions,
          }),
        });

        show('Role created successfully.');
      }

      closeModal();
      await loadData();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to save role.';

      setError(message);
      show(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Role
  |--------------------------------------------------------------------------
  */

  const deleteRole = async (role: Role) => {
    if (role.name === 'admin') {
      show('The Admin role cannot be deleted.', 'error');
      return;
    }

    if (role.name === 'super-admin') {
      show('Super Admin is protected from deletion.', 'error');
      return;
    }

    if (role.users_count > 0) {
      show(
        'This role cannot be deleted while users are assigned to it.',
        'error'
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete the "${formatRoleName(role.name)}" role?`
    );

    if (!confirmed) return;

    try {
      await apiFetch(`/api/admin/roles/${role.id}`, {
        method: 'DELETE',
      });

      show('Role deleted successfully.');
      await loadData();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Failed to delete role.';

      show(message, 'error');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        subtitle={
          loading
            ? 'Loading roles...'
            : `${roles.length} roles configured`
        }
        action={
          <AdminButton onClick={openCreateModal}>
            <Plus size={16} />
            Add Role
          </AdminButton>
        }
      />

      {error && !modalOpen && (
        <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex items-center gap-3 text-cream/50">
            <Loader2 size={20} className="animate-spin" />
            Loading roles and permissions...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Roles */}
          <div className="space-y-4">
            {roles.map((role, i) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-lg p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20">
                      <Shield size={18} className="text-gold" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-cream">
                          {formatRoleName(role.name)}
                        </h3>

                        {role.protected && (
                          <span className="rounded-full border border-gold/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gold">
                            Protected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-cream/40">
                        {role.description}
                      </p>

                      <div className="mt-2 flex gap-4">
                        <span className="text-xs text-cream/50">
                          {role.users_count} users
                        </span>

                        <span className="text-xs text-cream/50">
                          {role.permissions_count} permissions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() => openEditModal(role)}
                      disabled={role.name === 'admin'}
                      title={
                        role.name === 'admin'
                          ? 'Admin role is protected'
                          : 'Edit role'
                      }
                      className="text-cream/40 transition hover:text-gold disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => deleteRole(role)}
                      disabled={
                        role.name === 'admin' ||
                        role.name === 'super-admin' ||
                        role.users_count > 0
                      }
                      title={
                        role.name === 'admin'
                          ? 'Admin role is protected'
                          : role.name === 'super-admin'
                            ? 'Super Admin cannot be deleted'
                            : role.users_count > 0
                              ? 'Role has assigned users'
                              : 'Delete role'
                      }
                      className="text-cream/40 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-20"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>
              </motion.div>
            ))}

            {roles.length === 0 && (
              <div className="glass rounded-lg p-8 text-center text-sm text-cream/40">
                No roles found.
              </div>
            )}
          </div>

          {/* Permission Matrix */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-lg p-6"
          >
            <h3 className="mb-6 font-serif text-xl text-cream">
              Permission Matrix
            </h3>

            <div className="space-y-4">
              {permissionGroups.map(([group, groupPermissions]) => {
                const allSelected = groupPermissions.every((permission) =>
                  selectedPermissions.includes(permission.name)
                );

                return (
                  <div
                    key={group}
                    className="border-b border-white/5 pb-4 last:border-0"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-gold">
                        {group}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleGroup(groupPermissions)}
                        className="text-[10px] uppercase tracking-wider text-cream/40 hover:text-gold"
                      >
                        {allSelected ? 'Clear' : 'Select All'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {groupPermissions.map((permission) => {
                        const selected = selectedPermissions.includes(
                          permission.name
                        );

                        return (
                          <button
                            key={permission.id}
                            type="button"
                            onClick={() =>
                              togglePermission(permission.name)
                            }
                            className={`rounded px-3 py-1.5 text-xs transition ${
                              selected
                                ? 'border border-gold/30 bg-gold/10 text-gold'
                                : 'glass text-cream/60 hover:text-cream'
                            }`}
                          >
                            {permissionLabel(permission.name)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {permissionGroups.length === 0 && (
                <p className="text-sm text-cream/40">
                  No permissions configured.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingRole ? 'Edit Role' : 'Add Role'}
        size="lg"
      >
        <div className="space-y-5">

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-cream/50">
              Role Name
            </label>

            <input
              value={roleName}
              onChange={(event) => setRoleName(event.target.value)}
              disabled={editingRole?.name === 'admin'}
              className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-cream placeholder-cream/30 focus:border-gold focus:outline-none disabled:opacity-40"
              placeholder="e.g. Store Manager"
            />

            <p className="mt-1.5 text-[11px] text-cream/30">
              Spaces are automatically converted to hyphens.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-cream/50">
                Permissions
              </p>

              <span className="text-xs text-cream/30">
                {selectedPermissions.length} selected
              </span>
            </div>

            <div className="max-h-[400px] space-y-4 overflow-y-auto pr-2">
              {permissionGroups.map(([group, groupPermissions]) => {
                const allSelected = groupPermissions.every((permission) =>
                  selectedPermissions.includes(permission.name)
                );

                return (
                  <div
                    key={group}
                    className="rounded-md border border-white/5 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-gold">
                        {group}
                      </p>

                      <button
                        type="button"
                        onClick={() => toggleGroup(groupPermissions)}
                        className="text-[10px] uppercase tracking-wider text-cream/40 hover:text-gold"
                      >
                        {allSelected ? 'Clear All' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {groupPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex cursor-pointer items-center gap-2 text-xs text-cream/60"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(
                              permission.name
                            )}
                            onChange={() =>
                              togglePermission(permission.name)
                            }
                            className="accent-gold"
                          />

                          {permissionLabel(permission.name)}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <AdminButton
              variant="outline"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </AdminButton>

            <AdminButton
              onClick={saveRole}
              disabled={saving || editingRole?.name === 'admin'}
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : editingRole ? (
                'Save Changes'
              ) : (
                'Create Role'
              )}
            </AdminButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

