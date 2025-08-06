// components/layout/Breadcrumb.tsx
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { NavigationGroup } from '../../lib/navigation/types';

interface BreadcrumbProps {
  activeModule: string;
  navigation: NavigationGroup[];
  onNavigate: (moduleId: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  activeModule,
  navigation,
  onNavigate
}) => {
  // Find the active group and item
  const activeGroup = navigation.find(group => 
    group.items.some(item => item.id === activeModule)
  );
  const activeItem = activeGroup?.items.find(item => item.id === activeModule);

  if (!activeGroup || !activeItem) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
      <button
        onClick={() => onNavigate('live-prices')}
        className="flex items-center hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="ml-1">Dashboard</span>
      </button>
      
      <ChevronRight className="h-4 w-4" />
      
      <span className="text-gray-600 dark:text-gray-300">
        {activeGroup.label}
      </span>
      
      <ChevronRight className="h-4 w-4" />
      
      <span className="text-gray-900 dark:text-gray-100 font-medium">
        {activeItem.label}
      </span>
    </nav>
  );
};
