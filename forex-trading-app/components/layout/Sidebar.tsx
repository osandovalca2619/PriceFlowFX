// components/layout/Sidebar.tsx
import React from 'react';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  TrendingUp,
  User,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  LogOut,
  Settings
} from 'lucide-react';
import { NavigationGroup } from '@/lib/navigation/types';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme/theme-provider';

interface SidebarProps {
  navigation: NavigationGroup[];
  activeModule: string;
  sidebarCollapsed: boolean;
  expandedGroups: Set<string>;
  user: any;
  isApiAuthenticated: boolean;
  onToggleSidebar: () => void;
  onToggleGroup: (groupId: string) => void;
  onModuleChange: (moduleId: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navigation,
  activeModule,
  sidebarCollapsed,
  expandedGroups,
  user,
  isApiAuthenticated,
  onToggleSidebar,
  onToggleGroup,
  onModuleChange,
  onLogout
}) => {
  const { theme, setTheme } = useTheme();

  const getUserDisplayName = (user: any): string => {
    return user.name || user.fullName || user.username || user.email || 'Usuario';
  };

  const getProfileDisplayName = (user: any): string => {
    if (user.profileName) return user.profileName;
    
    const roleProfileMap: Record<string, string> = {
      'admin': 'Administrador',
      'trading': 'Trader', 
      'sales': 'Ventas',
      'middle': 'Middle Office',
      'user': 'Usuario'
    };
    
    return roleProfileMap[user.role || 'user'] || 'Usuario';
  };

  return (
    <div className={`
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
      flex flex-col transition-all duration-300 ease-in-out z-30
      ${sidebarCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                PriceFlowFX
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="p-1.5"
          >
            {sidebarCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          const hasActiveItem = group.items.some(item => item.id === activeModule);
          
          return (
            <div key={group.id} className="space-y-1">
              <Button
                variant="ghost"
                onClick={() => onToggleGroup(group.id)}
                className={`
                  w-full justify-between text-sm font-medium
                  ${hasActiveItem ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}
                  ${sidebarCollapsed ? 'px-3 justify-center' : 'px-3'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <group.icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{group.label}</span>}
                </div>
                {!sidebarCollapsed && (
                  isExpanded ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              {/* Submenu Items */}
              {(!sidebarCollapsed && isExpanded) && (
                <div className="ml-4 space-y-1">
                  {group.items.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      onClick={() => onModuleChange(item.id)}
                      className={`
                        w-full justify-start text-sm px-3 py-2
                        ${activeModule === item.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }
                      `}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0 mr-3" />
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}

              {/* Collapsed tooltips */}
              {sidebarCollapsed && (
                <div className="hidden group-hover:block absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50">
                  {group.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {getProfileDisplayName(user)}
                </p>
              </div>
            </div>
            
            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              {/* Connection Status */}
              <div className="flex items-center space-x-1 text-xs">
                {isApiAuthenticated ? (
                  <>
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">API</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 text-orange-500" />
                    <span className="text-orange-600 dark:text-orange-400">Local</span>
                  </>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="p-1"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed User Section */
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
