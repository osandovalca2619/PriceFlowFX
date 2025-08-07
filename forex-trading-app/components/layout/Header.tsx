// components/layout/Header.tsx
import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronRight,
  X,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { NavigationGroup } from '@/lib/navigation/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  module?: string;
}

interface HeaderProps {
  activeModule: string;
  navigation: NavigationGroup[];
  notifications: Notification[];
  unreadCount: number;
  searchQuery: string;
  isApiAuthenticated: boolean;
  onSearchChange: (query: string) => void;
  onNotificationDismiss: (id: string) => void;
  onMarkAllRead: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeModule,
  navigation,
  notifications,
  unreadCount,
  searchQuery,
  isApiAuthenticated,
  onSearchChange,
  onNotificationDismiss,
  onMarkAllRead
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Encontrar el grupo y elemento activo
  const activeGroup = navigation.find(group => 
    group.items.some(item => item.id === activeModule)
  );
  const activeItem = activeGroup?.items.find(item => item.id === activeModule);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'error':
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return timestamp.toLocaleDateString();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Current Module Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {activeItem && (
              <>
                <activeItem.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">
                  {activeItem.label}
                </span>
                {activeGroup && activeGroup.label !== activeItem.label && (
                  <>
                    <span className="text-gray-400">en</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {activeGroup.label}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: Search and Actions */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          <div className="relative">
            <div className={`
              relative flex items-center transition-all duration-200
              ${isSearchFocused ? 'w-80' : 'w-64'}
            `}>
              <Search className="h-4 w-4 absolute left-3 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar clientes, operaciones... (⌘K)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-9 pr-4 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Search Results Dropdown (placeholder) */}
            {searchQuery && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                  Buscar "{searchQuery}"...
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-[1.25rem]"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* Dropdown Content */}
            {isNotificationOpen && (
              <>
                {/* Overlay para cerrar al hacer click fuera */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationOpen(false)}
                />
                
                {/* Contenido del dropdown */}
                <div className="absolute right-0 top-full mt-1 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Notificaciones
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onMarkAllRead();
                          setIsNotificationOpen(false);
                        }}
                        className="text-xs"
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No hay notificaciones
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div key={notification.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 group">
                          <div className="flex items-start space-x-3 w-full">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                  {notification.title}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNotificationDismiss(notification.id);
                                  }}
                                  className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatNotificationTime(notification.timestamp)}</span>
                                </div>
                                {notification.module && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.module}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Connection Status */}
          <div className={`
            flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium
            ${isApiAuthenticated 
              ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
              : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
            }
          `}>
            <div className={`w-2 h-2 rounded-full ${isApiAuthenticated ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <span>
              {isApiAuthenticated ? 'API Conectada' : 'Modo Local'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};