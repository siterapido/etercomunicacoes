type Permission = "create" | "read" | "update" | "delete" | "assign" | "config";
type Resource = "projects" | "tasks" | "clients" | "users";

const ROLE_PERMISSIONS: Record<string, Record<Resource, Permission[]>> = {
  admin: {
    projects: ["create", "read", "update", "delete", "config"],
    tasks: ["create", "read", "update", "delete", "assign"],
    clients: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
  },
  manager: {
    projects: ["create", "read", "update"],
    tasks: ["create", "read", "update", "delete", "assign"],
    clients: ["create", "read", "update"],
    users: ["read"],
  },
  designer: {
    projects: ["read"],
    tasks: ["read", "update"],
    clients: ["read"],
    users: ["read"],
  },
  writer: {
    projects: ["read"],
    tasks: ["read", "update"],
    clients: ["read"],
    users: ["read"],
  },
};

export function hasPermission(
  role: string,
  resource: Resource,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;
  return rolePermissions[resource]?.includes(permission) ?? false;
}

export function requirePermission(
  role: string,
  resource: Resource,
  permission: Permission
): void {
  if (!hasPermission(role, resource, permission)) {
    throw new Error(
      `Permissão negada: ${role} não pode ${permission} em ${resource}`
    );
  }
}
