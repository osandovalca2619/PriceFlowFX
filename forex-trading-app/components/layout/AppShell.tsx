// components/layout/AppShell.tsx
import React, { useState } from 'react';
import { useAppShell } from '@/hooks/useAppShell';
import { useNavigation } from '@/hooks/useNavigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { ModuleRenderer } from './ModuleRenderer';

// Importar todos los módulos existentes
import PriceDashboard from '@/components/PriceDashboard';
import { PositionMX } from '@/components/trading/position-mx';
import { OperationsQuery } from '@/components/shared/operations-query';
import { TradingSpreadManager } from '@/components/trading/trading-spread-manager';
import { PricesModule } from '@/components/sales/prices-module';
import { SalesSpreadManager } from '@/components/sales/sales-spread-manager';
import { ExceptionSpreadManager } from '@/components/sales/exception-spread-manager';
import { ClientsManager } from '@/components/middle/clients-manager';
import { HolidaysManager } from '@/components/middle/holidays-manager';
import { BooksManager } from '@/components/middle/books-manager';
import { CurrenciesManager } from '@/components/middle/currencies-manager';
import { UsersManager } from '@/components/middle/users-manager';
import SalesQuotationModule from '@/components/sales/SalesQuotationModule';

interface User {
  id: number;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  profileId?: number;
  profileName?: string;
  permissions?: string[];
}

interface AppShellProps {
  user: User;
  onLogout: () => void;
  isApiAuthenticated?: boolean;
}

// Mapeo de módulos a componentes
const MODULE_COMPONENTS = {
  'live-prices': PriceDashboard,
  'position-mx': PositionMX,
  'spreads-trading': TradingSpreadManager,
  'operations-trading': OperationsQuery,
  'operations-sales': OperationsQuery,
  'operations-middle': OperationsQuery,
  'prices-sales': PricesModule,
  'spreads-sales': SalesSpreadManager,
  'spreads-exceptions': ExceptionSpreadManager,
  'quotation-sales': SalesQuotationModule,
  'clients': ClientsManager,
  'holidays': HolidaysManager,
  'books': BooksManager,
  'currencies': CurrenciesManager,
  'users': UsersManager,
} as const;

export const AppShell: React.FC<AppShellProps> = ({ 
  user, 
  onLogout, 
  isApiAuthenticated = false 
}) => {
  const {
    navigation,
    handleModuleChange,
    handleLogout,
    notifications,
    unreadCount,
    dismissNotification,        // ← Agregar esta línea
    markAllNotificationsRead    // ← Agregar esta línea
  } = useAppShell(user, onLogout, 'live-prices');

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        navigation={navigation.navigation}
        activeModule={navigation.activeModule}
        sidebarCollapsed={navigation.sidebarCollapsed}
        expandedGroups={navigation.expandedGroups}
        user={user}
        isApiAuthenticated={isApiAuthenticated}
        onToggleSidebar={navigation.toggleSidebar}
        onToggleGroup={navigation.toggleGroup}
        onModuleChange={handleModuleChange}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          activeModule={navigation.activeModule}
          navigation={navigation.navigation}
          notifications={notifications}
          unreadCount={unreadCount}
          searchQuery={searchQuery}
          isApiAuthenticated={isApiAuthenticated}
          onSearchChange={setSearchQuery}
          onNotificationDismiss={dismissNotification}
          onMarkAllRead={markAllNotificationsRead}
        />

        {/* Breadcrumb */}
        <div className="px-6 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <Breadcrumb
            activeModule={navigation.activeModule}
            navigation={navigation.navigation}
            onNavigate={handleModuleChange}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <ModuleRenderer
              activeModule={navigation.activeModule}
              user={user}
              moduleComponents={MODULE_COMPONENTS}
            />
          </div>
        </main>
      </div>
    </div>
  );
};