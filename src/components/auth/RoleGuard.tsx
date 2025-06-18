'use client'

import { ReactNode } from 'react'
import { Role, Permission, hasPermission, hasAnyPermission } from '@/lib/rbac'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: Role[]
  requiredPermissions?: Permission[]
  requireAll?: boolean // If true, user must have ALL permissions; if false, ANY permission
  userRole?: Role
  fallback?: ReactNode
  showFallback?: boolean
}

export function RoleGuard({
  children,
  allowedRoles,
  requiredPermissions,
  requireAll = false,
  userRole,
  fallback = null,
  showFallback = false
}: RoleGuardProps) {
  // If no user role provided, don't render anything
  if (!userRole) {
    return showFallback ? <>{fallback}</> : null
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return showFallback ? <>{fallback}</> : null
  }

  // Check permission-based access
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every(permission => hasPermission(userRole, permission))
      : hasAnyPermission(userRole, requiredPermissions)

    if (!hasAccess) {
      return showFallback ? <>{fallback}</> : null
    }
  }

  return <>{children}</>
}

// Specific role guards for common use cases
interface SuperAdminGuardProps {
  children: ReactNode
  userRole?: Role
  fallback?: ReactNode
}

export function SuperAdminGuard({ children, userRole, fallback }: SuperAdminGuardProps) {
  return (
    <RoleGuard
      allowedRoles={[Role.SUPER_ADMIN]}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}

interface AdminGuardProps {
  children: ReactNode
  userRole?: Role
  fallback?: ReactNode
  includeSuperAdmin?: boolean
}

export function AdminGuard({ children, userRole, fallback, includeSuperAdmin = true }: AdminGuardProps) {
  const allowedRoles = includeSuperAdmin 
    ? [Role.SUPER_ADMIN, Role.ADMIN]
    : [Role.ADMIN]

  return (
    <RoleGuard
      allowedRoles={allowedRoles}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}

interface EditorGuardProps {
  children: ReactNode
  userRole?: Role
  fallback?: ReactNode
  includeHigherRoles?: boolean
}

export function EditorGuard({ children, userRole, fallback, includeHigherRoles = true }: EditorGuardProps) {
  const allowedRoles = includeHigherRoles 
    ? [Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]
    : [Role.EDITOR]

  return (
    <RoleGuard
      allowedRoles={allowedRoles}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}

// Permission-based guards
interface PermissionGuardProps {
  children: ReactNode
  permissions: Permission[]
  userRole?: Role
  requireAll?: boolean
  fallback?: ReactNode
}

export function PermissionGuard({ 
  children, 
  permissions, 
  userRole, 
  requireAll = false, 
  fallback 
}: PermissionGuardProps) {
  return (
    <RoleGuard
      requiredPermissions={permissions}
      requireAll={requireAll}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  )
}

// Content management guards
export function CanCreateContent({ children, userRole, fallback }: { children: ReactNode, userRole?: Role, fallback?: ReactNode }) {
  return (
    <PermissionGuard
      permissions={[Permission.CREATE_KECAMATAN, Permission.CREATE_NEWS, Permission.CREATE_GALLERY]}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  )
}

export function CanEditContent({ children, userRole, fallback }: { children: ReactNode, userRole?: Role, fallback?: ReactNode }) {
  return (
    <PermissionGuard
      permissions={[Permission.UPDATE_KECAMATAN, Permission.UPDATE_NEWS, Permission.UPDATE_GALLERY]}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  )
}

export function CanDeleteContent({ children, userRole, fallback }: { children: ReactNode, userRole?: Role, fallback?: ReactNode }) {
  return (
    <PermissionGuard
      permissions={[Permission.DELETE_KECAMATAN, Permission.DELETE_NEWS, Permission.DELETE_GALLERY]}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  )
}

export function CanManageUsers({ children, userRole, fallback }: { children: ReactNode, userRole?: Role, fallback?: ReactNode }) {
  return (
    <PermissionGuard
      permissions={[Permission.CREATE_USER, Permission.UPDATE_USER, Permission.DELETE_USER]}
      userRole={userRole}
      fallback={fallback}
    >
      {children}
    </PermissionGuard>
  )
}

// Hook for checking permissions in components
export function usePermissions(userRole?: Role) {
  return {
    hasPermission: (permission: Permission) => userRole ? hasPermission(userRole, permission) : false,
    hasAnyPermission: (permissions: Permission[]) => userRole ? hasAnyPermission(userRole, permissions) : false,
    hasAllPermissions: (permissions: Permission[]) => userRole ? permissions.every(p => hasPermission(userRole, p)) : false,
    canCreate: userRole ? hasAnyPermission(userRole, [Permission.CREATE_KECAMATAN, Permission.CREATE_NEWS, Permission.CREATE_GALLERY]) : false,
    canEdit: userRole ? hasAnyPermission(userRole, [Permission.UPDATE_KECAMATAN, Permission.UPDATE_NEWS, Permission.UPDATE_GALLERY]) : false,
    canDelete: userRole ? hasAnyPermission(userRole, [Permission.DELETE_KECAMATAN, Permission.DELETE_NEWS, Permission.DELETE_GALLERY]) : false,
    canManageUsers: userRole ? hasAnyPermission(userRole, [Permission.CREATE_USER, Permission.UPDATE_USER, Permission.DELETE_USER]) : false,
    canViewAnalytics: userRole ? hasPermission(userRole, Permission.VIEW_ANALYTICS) : false,
    canViewAuditLogs: userRole ? hasPermission(userRole, Permission.VIEW_AUDIT_LOGS) : false,
    isSuperAdmin: userRole === Role.SUPER_ADMIN,
    isAdmin: userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN,
    isEditor: userRole === Role.EDITOR || userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN,
    isViewer: userRole === Role.VIEWER
  }
}

// Role display component
interface RoleDisplayProps {
  role: Role
  className?: string
}

export function RoleDisplay({ role, className = '' }: RoleDisplayProps) {
  const roleConfig = {
    [Role.SUPER_ADMIN]: { label: 'Super Admin', color: 'bg-red-100 text-red-800' },
    [Role.ADMIN]: { label: 'Admin', color: 'bg-blue-100 text-blue-800' },
    [Role.EDITOR]: { label: 'Editor', color: 'bg-green-100 text-green-800' },
    [Role.VIEWER]: { label: 'Viewer', color: 'bg-gray-100 text-gray-800' }
  }

  const config = roleConfig[role]

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  )
}
