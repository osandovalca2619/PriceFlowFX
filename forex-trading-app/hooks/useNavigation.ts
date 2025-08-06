// hooks/useNavigation.ts
import { useState, useCallback, useMemo } from 'react';
import { User, NavigationGroup } from '../lib/navigation/types';
import { getNavigationForRole, getUserRole } from '../lib/navigation/config';

export interface UseNavigationReturn {
  // Navigation state
  navigation: NavigationGroup[];
  activeModule: string;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  expandedGroups: Set<string>;
  
  // Actions
  setActiveModule: (moduleId: string) => void;
  toggleSidebar: () => void;
  toggleGroup: (groupId: string) => void;
  
  // Utilities
  isModuleActive: (moduleId: string) => boolean;
  getActiveGroup: () => NavigationGroup | undefined;
  getModuleById: (moduleId: string) => NavigationGroup['items'][0] | undefined;
}

export const useNavigation = (
  user: User,
  initialModule: string = 'live-prices'
): UseNavigationReturn => {
  const [activeModule, setActiveModule] = useState(initialModule);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Get navigation based on user role
  const navigation = useMemo(() => {
    const role = getUserRole(user);
    const nav = getNavigationForRole(role);
    
    // Auto-expand default groups
    const defaultExpanded = nav
      .filter(group => group.defaultOpen)
      .map(group => group.id);
    
    setExpandedGroups(new Set(defaultExpanded));
    
    return nav;
  }, [user]);

  // Toggle sidebar collapsed state
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Toggle group expanded state
  const toggleGroup = useCallback((groupId: string) => {
    if (sidebarCollapsed) return; // Don't toggle when collapsed
    
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, [sidebarCollapsed]);

  // Check if module is active
  const isModuleActive = useCallback((moduleId: string) => {
    return activeModule === moduleId;
  }, [activeModule]);

  // Get the group that contains the active module
  const getActiveGroup = useCallback(() => {
    return navigation.find(group => 
      group.items.some(item => item.id === activeModule)
    );
  }, [navigation, activeModule]);

  // Get module by ID across all groups
  const getModuleById = useCallback((moduleId: string) => {
    for (const group of navigation) {
      const module = group.items.find(item => item.id === moduleId);
      if (module) return module;
    }
    return undefined;
  }, [navigation]);

  return {
    // Navigation state
    navigation,
    activeModule,
    
    // Sidebar state
    sidebarCollapsed,
    expandedGroups,
    
    // Actions
    setActiveModule,
    toggleSidebar,
    toggleGroup,
    
    // Utilities
    isModuleActive,
    getActiveGroup,
    getModuleById,
  };
};