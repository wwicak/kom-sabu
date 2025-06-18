// Role-Based Access Control (RBAC) System
export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  MANAGE_ROLES = 'manage_roles',
  
  // Kecamatan Management
  CREATE_KECAMATAN = 'create_kecamatan',
  READ_KECAMATAN = 'read_kecamatan',
  UPDATE_KECAMATAN = 'update_kecamatan',
  DELETE_KECAMATAN = 'delete_kecamatan',
  
  // Content Management
  CREATE_NEWS = 'create_news',
  READ_NEWS = 'read_news',
  UPDATE_NEWS = 'update_news',
  DELETE_NEWS = 'delete_news',
  PUBLISH_NEWS = 'publish_news',
  
  // Gallery Management
  CREATE_GALLERY = 'create_gallery',
  READ_GALLERY = 'read_gallery',
  UPDATE_GALLERY = 'update_gallery',
  DELETE_GALLERY = 'delete_gallery',
  
  // Contact Form Management
  READ_CONTACT = 'read_contact',
  UPDATE_CONTACT = 'update_contact',
  DELETE_CONTACT = 'delete_contact',
  
  // Agenda Management
  CREATE_AGENDA = 'create_agenda',
  READ_AGENDA = 'read_agenda',
  UPDATE_AGENDA = 'update_agenda',
  DELETE_AGENDA = 'delete_agenda',
  
  // System Management
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_SETTINGS = 'manage_settings',
  VIEW_ANALYTICS = 'view_analytics'
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(Permission)
  ],
  
  [Role.ADMIN]: [
    // Content management (all)
    Permission.CREATE_KECAMATAN,
    Permission.READ_KECAMATAN,
    Permission.UPDATE_KECAMATAN,
    Permission.DELETE_KECAMATAN,
    
    Permission.CREATE_NEWS,
    Permission.READ_NEWS,
    Permission.UPDATE_NEWS,
    Permission.DELETE_NEWS,
    Permission.PUBLISH_NEWS,
    
    Permission.CREATE_GALLERY,
    Permission.READ_GALLERY,
    Permission.UPDATE_GALLERY,
    Permission.DELETE_GALLERY,
    
    Permission.CREATE_AGENDA,
    Permission.READ_AGENDA,
    Permission.UPDATE_AGENDA,
    Permission.DELETE_AGENDA,
    
    Permission.READ_CONTACT,
    Permission.UPDATE_CONTACT,
    Permission.DELETE_CONTACT,
    
    // Limited user management (no role changes)
    Permission.READ_USER,
    Permission.UPDATE_USER,
    
    // Analytics and logs
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_ANALYTICS
  ],
  
  [Role.EDITOR]: [
    // Content creation and editing (no deletion)
    Permission.CREATE_KECAMATAN,
    Permission.READ_KECAMATAN,
    Permission.UPDATE_KECAMATAN,
    
    Permission.CREATE_NEWS,
    Permission.READ_NEWS,
    Permission.UPDATE_NEWS,
    
    Permission.CREATE_GALLERY,
    Permission.READ_GALLERY,
    Permission.UPDATE_GALLERY,
    
    Permission.CREATE_AGENDA,
    Permission.READ_AGENDA,
    Permission.UPDATE_AGENDA,
    
    Permission.READ_CONTACT,
    Permission.UPDATE_CONTACT,
    
    // Own profile management
    Permission.READ_USER,
    Permission.UPDATE_USER
  ],
  
  [Role.VIEWER]: [
    // Read-only access
    Permission.READ_KECAMATAN,
    Permission.READ_NEWS,
    Permission.READ_GALLERY,
    Permission.READ_AGENDA,
    Permission.READ_CONTACT,
    Permission.READ_USER,
    Permission.VIEW_ANALYTICS
  ]
}

// Helper functions
export function hasPermission(userRole: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission))
}

export function getRoleHierarchy(): Record<Role, number> {
  return {
    [Role.SUPER_ADMIN]: 4,
    [Role.ADMIN]: 3,
    [Role.EDITOR]: 2,
    [Role.VIEWER]: 1
  }
}

export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  const hierarchy = getRoleHierarchy()
  return hierarchy[managerRole] > hierarchy[targetRole]
}

export function getAvailableRoles(userRole: Role): Role[] {
  const hierarchy = getRoleHierarchy()
  const userLevel = hierarchy[userRole]
  
  return Object.entries(hierarchy)
    .filter(([_, level]) => level < userLevel)
    .map(([role, _]) => role as Role)
}

// Resource-based permissions
export interface ResourcePermission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export function checkResourcePermission(
  userRole: Role,
  userId: string,
  resource: ResourcePermission
): boolean {
  // Check basic permission first
  const permission = `${resource.action}_${resource.resource}` as Permission
  if (!hasPermission(userRole, permission)) {
    return false
  }
  
  // Check additional conditions
  if (resource.conditions) {
    // Owner-only access for certain operations
    if (resource.conditions.ownerOnly && resource.conditions.ownerId !== userId) {
      return false
    }
    
    // Department-specific access
    if (resource.conditions.department && resource.conditions.userDepartment !== resource.conditions.department) {
      return false
    }
  }
  
  return true
}

// Permission decorators for API routes
export function requirePermission(permission: Permission) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    
    descriptor.value = async function(...args: any[]) {
      const request = args[0] // Assuming first argument is the request
      const user = request.user // Assuming user is attached to request
      
      if (!user || !hasPermission(user.role, permission)) {
        throw new Error('Insufficient permissions')
      }
      
      return originalMethod.apply(this, args)
    }
    
    return descriptor
  }
}

// Role validation
export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role)
}

export function getDefaultRole(): Role {
  return Role.VIEWER
}

// Permission groups for UI
export const PERMISSION_GROUPS = {
  'User Management': [
    Permission.CREATE_USER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.MANAGE_ROLES
  ],
  'Content Management': [
    Permission.CREATE_KECAMATAN,
    Permission.READ_KECAMATAN,
    Permission.UPDATE_KECAMATAN,
    Permission.DELETE_KECAMATAN,
    Permission.CREATE_NEWS,
    Permission.READ_NEWS,
    Permission.UPDATE_NEWS,
    Permission.DELETE_NEWS,
    Permission.PUBLISH_NEWS
  ],
  'Media Management': [
    Permission.CREATE_GALLERY,
    Permission.READ_GALLERY,
    Permission.UPDATE_GALLERY,
    Permission.DELETE_GALLERY
  ],
  'Communication': [
    Permission.READ_CONTACT,
    Permission.UPDATE_CONTACT,
    Permission.DELETE_CONTACT,
    Permission.CREATE_AGENDA,
    Permission.READ_AGENDA,
    Permission.UPDATE_AGENDA,
    Permission.DELETE_AGENDA
  ],
  'System': [
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_ANALYTICS
  ]
}
