// hooks/useAppShell.ts
import { useState, useCallback } from 'react';
import { User } from '../lib/navigation/types';
import { useNavigation } from './useNavigation';

export interface UseAppShellReturn {
  // User state
  user: User;
  
  // Navigation
  navigation: ReturnType<typeof useNavigation>;
  
  // UI state
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  handleModuleChange: (moduleId: string) => void;
  handleLogout: () => void;
  dismissNotification: (id: string) => void;
  markAllNotificationsRead: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
  module?: string;
}

export const useAppShell = (
  user: User,
  onLogout: () => void,
  initialModule?: string
): UseAppShellReturn => {
  const navigation = useNavigation(user, initialModule);
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nueva operación pendiente',
      message: 'Operación EUR/USD por $100,000 requiere aprobación',
      type: 'warning',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      module: 'operations-trading'
    },
    {
      id: '2',
      title: 'Precio actualizado',
      message: 'USD/CLP actualizado a 950.25',
      type: 'info',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      read: false,
      module: 'live-prices'
    },
    {
      id: '3',
      title: 'Spread modificado',
      message: 'Spread EUR/USD actualizado para segmento Premium',
      type: 'success',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: true,
      module: 'spreads-sales'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle module change with analytics
  const handleModuleChange = useCallback((moduleId: string) => {
    navigation.setActiveModule(moduleId);
    
    // Analytics tracking (optional)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: moduleId,
        page_location: window.location.href
      });
    }
  }, [navigation]);

  // Handle logout with cleanup
  const handleLogout = useCallback(() => {
    // Clear any app state if needed
    setNotifications([]);
    
    // Call the provided logout function
    onLogout();
  }, [onLogout]);

  // Dismiss notification
  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Mark all notifications as read
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return {
    user,
    navigation,
    notifications,
    unreadCount,
    handleModuleChange,
    handleLogout,
    dismissNotification,
    markAllNotificationsRead,
  };
};
