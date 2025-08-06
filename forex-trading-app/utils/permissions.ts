// utils/permissions.ts
export const hasPermission = (
  userPermissions: string[] = [],
  requiredPermission: string | string[]
): boolean => {
  if (!requiredPermission) return true;
  
  const permissions = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];
  
  // Admin has all permissions
  if (userPermissions.includes('all') || userPermissions.includes('admin')) {
    return true;
  }
  
  // Check if user has at least one of the required permissions
  return permissions.some(permission => 
    userPermissions.includes(permission)
  );
};

export const filterNavigationByPermissions = (
  navigation: NavigationGroup[],
  userPermissions: string[] = []
): NavigationGroup[] => {
  return navigation
    .map(group => ({
      ...group,
      items: group.items.filter(item => 
        hasPermission(userPermissions, item.permissions)
      )
    }))
    .filter(group => 
      group.items.length > 0 && 
      hasPermission(userPermissions, group.permissions)
    );
};
