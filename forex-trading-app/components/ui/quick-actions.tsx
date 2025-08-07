import React from 'react';
import { Plus, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'outline';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  actions, 
  className 
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {actions.map((action) => (
        <Button
          key={action.id}
          variant={action.variant || 'outline'}
          size="sm"
          onClick={action.onClick}
          disabled={action.disabled}
          className="flex items-center space-x-2"
        >
          <action.icon className="h-4 w-4" />
          <span>{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

// Exportar acciones comunes predefinidas
export const commonActions = {
  create: (onClick: () => void): QuickAction => ({
    id: 'create',
    label: 'Nuevo',
    icon: Plus,
    onClick,
    variant: 'default' as const
  }),
  search: (onClick: () => void): QuickAction => ({
    id: 'search',
    label: 'Buscar',
    icon: Search,
    onClick,
    variant: 'outline' as const
  }),
  filter: (onClick: () => void): QuickAction => ({
    id: 'filter',
    label: 'Filtros',
    icon: Filter,
    onClick,
    variant: 'outline' as const
  }),
  export: (onClick: () => void): QuickAction => ({
    id: 'export',
    label: 'Exportar',
    icon: Download,
    onClick,
    variant: 'outline' as const
  }),
  refresh: (onClick: () => void): QuickAction => ({
    id: 'refresh',
    label: 'Actualizar',
    icon: RefreshCw,
    onClick,
    variant: 'outline' as const
  })
};