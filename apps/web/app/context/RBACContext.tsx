"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// User Roles Enum
export enum UserRole {
  STUDENT = "STUDENT",
  CLUB_ADMIN = "CLUB_ADMIN",
  COLLEGE_ADMIN = "COLLEGE_ADMIN",
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
}

// Permission Types
export type Permission =
  | "create:post"
  | "create:anonymous_post"
  | "create:event"
  | "create:listing"
  | "upload:notes"
  | "join:club"
  | "rsvp:event"
  | "manage:own_club"
  | "manage:club_members"
  | "create:club_event"
  | "generate:certificates"
  | "approve:events"
  | "moderate:feed"
  | "edit:college_info"
  | "create:club"
  | "manage:all_colleges"
  | "global:ban"
  | "configure:platform"
  | "view:analytics"
  | "view:club_stats"
  | "view:college_stats"
  | "view:all_stats"
  | "reveal:anonymous";

// Role-Permission Mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: [
    "create:post",
    "create:anonymous_post",
    "create:listing",
    "upload:notes",
    "join:club",
    "rsvp:event",
  ],
  [UserRole.CLUB_ADMIN]: [
    "create:post",
    "create:anonymous_post",
    "create:listing",
    "upload:notes",
    "join:club",
    "rsvp:event",
    "manage:own_club",
    "manage:club_members",
    "create:club_event",
    "generate:certificates",
    "view:club_stats",
  ],
  [UserRole.COLLEGE_ADMIN]: [
    "create:post",
    "create:anonymous_post",
    "create:listing",
    "upload:notes",
    "join:club",
    "rsvp:event",
    "manage:own_club",
    "manage:club_members",
    "create:club_event",
    "generate:certificates",
    "approve:events",
    "moderate:feed",
    "edit:college_info",
    "create:club",
    "view:club_stats",
    "view:college_stats",
  ],
  [UserRole.PLATFORM_ADMIN]: [
    "create:post",
    "create:anonymous_post",
    "create:listing",
    "upload:notes",
    "join:club",
    "rsvp:event",
    "manage:own_club",
    "manage:club_members",
    "create:club_event",
    "generate:certificates",
    "approve:events",
    "moderate:feed",
    "edit:college_info",
    "create:club",
    "manage:all_colleges",
    "global:ban",
    "configure:platform",
    "view:club_stats",
    "view:college_stats",
    "view:all_stats",
    "reveal:anonymous",
  ],
};

// RBAC Context Interface
interface RBACContextType {
  role: UserRole;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canManageClub: (clubId: string) => boolean;
  canManageCollege: (collegeId: string) => boolean;
  isAdmin: () => boolean;
  isCollegeAdmin: () => boolean;
  isPlatformAdmin: () => boolean;
}

const RBACContext = createContext<RBACContextType | null>(null);

interface RBACProviderProps {
  children: ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const { user } = useAuth();

  const value = useMemo<RBACContextType>(() => {
    // Default to STUDENT role if no user or role not set
    const role = (user?.role as UserRole) || UserRole.STUDENT;
    const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[UserRole.STUDENT];

    // Get user's managed clubs and college from profile
    // These fields may be added to the user object by the backend for admin users
    const userAny = user as any;
    const managedClubIds: string[] = userAny?.managedClubs?.map((c: any) => c.id) || [];
    const managedCollegeId: string | null = userAny?.managedCollege?.id || user?.profile?.collegeId || null;

    return {
      role,
      permissions,

      hasPermission: (permission: Permission) => permissions.includes(permission),

      hasAnyPermission: (perms: Permission[]) => perms.some((p) => permissions.includes(p)),

      hasAllPermissions: (perms: Permission[]) => perms.every((p) => permissions.includes(p)),

      canManageClub: (clubId: string) => {
        if (role === UserRole.PLATFORM_ADMIN) return true;
        if (role === UserRole.COLLEGE_ADMIN) return true; // Can manage all clubs in their college
        if (role === UserRole.CLUB_ADMIN) return managedClubIds.includes(clubId);
        return false;
      },

      canManageCollege: (collegeId: string) => {
        if (role === UserRole.PLATFORM_ADMIN) return true;
        if (role === UserRole.COLLEGE_ADMIN) return managedCollegeId === collegeId;
        return false;
      },

      isAdmin: () =>
        [UserRole.CLUB_ADMIN, UserRole.COLLEGE_ADMIN, UserRole.PLATFORM_ADMIN].includes(role),

      isCollegeAdmin: () =>
        [UserRole.COLLEGE_ADMIN, UserRole.PLATFORM_ADMIN].includes(role),

      isPlatformAdmin: () => role === UserRole.PLATFORM_ADMIN,
    };
  }, [user]);

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

// Hook to use RBAC context
export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}

// Hook for permission checks (convenience wrapper)
export function usePermissions() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();
  return { hasPermission, hasAnyPermission, hasAllPermissions };
}

// Component for conditional rendering based on permissions
interface RequirePermissionProps {
  permission: Permission | Permission[];
  mode?: "any" | "all";
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({
  permission,
  mode = "any",
  children,
  fallback = null,
}: RequirePermissionProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  const permissions = Array.isArray(permission) ? permission : [permission];
  const hasAccess =
    mode === "all"
      ? hasAllPermissions(permissions)
      : permissions.length === 1
      ? hasPermission(permissions[0])
      : hasAnyPermission(permissions);

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Component for role-based rendering
interface RequireRoleProps {
  roles: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ roles, children, fallback = null }: RequireRoleProps) {
  const { role } = useRBAC();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return allowedRoles.includes(role) ? <>{children}</> : <>{fallback}</>;
}
