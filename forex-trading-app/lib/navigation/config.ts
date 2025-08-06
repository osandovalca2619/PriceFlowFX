// lib/navigation/config.ts
import {
  BarChart3, DollarSign, Users, Settings,
  TrendingUp, FileText, PieChart, Shield,
  Calendar, BookOpen, Coins, UserCheck,
  Activity, AlertCircle
} from "lucide-react";
import { NavigationGroup, User } from './types';

export const NAVIGATION_CONFIG: Record<string, NavigationGroup[]> = {
  trading: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
      items: [
        { id: "live-prices", label: "Precios en Vivo", icon: TrendingUp }
      ],
      defaultOpen: true
    },
    {
      id: "trading",
      label: "Trading",
      icon: BarChart3,
      items: [
        { 
          id: "position-mx", 
          label: "Posición MX", 
          icon: PieChart,
          endpoint: "/fx-operations/position-mx"
        },
        { 
          id: "spreads-trading", 
          label: "Spreads Trading", 
          icon: Settings,
          endpoint: "/spreads/trading"
        },
        { 
          id: "operations-trading", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations",
          badge: "New"
        }
      ],
      defaultOpen: true
    }
  ],
  
  sales: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
      items: [
        { id: "live-prices", label: "Precios en Vivo", icon: TrendingUp }
      ],
      defaultOpen: true
    },
    {
      id: "sales",
      label: "Sales",
      icon: DollarSign,
      items: [
        { 
          id: "prices-sales", 
          label: "Cotizaciones", 
          icon: DollarSign,
          endpoint: "/currencies/pairs"
        },
        { 
          id: "spreads-sales", 
          label: "Spreads Ventas", 
          icon: Settings,
          endpoint: "/spreads/sales"
        },
        { 
          id: "spreads-exceptions", 
          label: "Spreads Excepción", 
          icon: AlertCircle,
          endpoint: "/spreads/exceptions"
        },
        { 
          id: "operations-sales", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations"
        }
      ],
      defaultOpen: true
    }
  ],
  
  middle: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
      items: [
        { id: "live-prices", label: "Precios en Vivo", icon: TrendingUp }
      ],
      defaultOpen: true
    },
    {
      id: "middle",
      label: "Middle Office",
      icon: Users,
      items: [
        { 
          id: "clients", 
          label: "Clientes", 
          icon: Users,
          endpoint: "/clients"
        },
        { 
          id: "books", 
          label: "Libros", 
          icon: BookOpen,
          endpoint: "/operation-folders"
        },
        { 
          id: "currencies", 
          label: "Divisas", 
          icon: Coins,
          endpoint: "/currencies"
        },
        { 
          id: "users", 
          label: "Usuarios", 
          icon: UserCheck,
          endpoint: "/users"
        },
        { 
          id: "operations-middle", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations"
        }
      ],
      defaultOpen: true
    },
    {
      id: "configuration",
      label: "Configuración",
      icon: Settings,
      items: [
        { 
          id: "holidays", 
          label: "Feriados", 
          icon: Calendar,
          endpoint: "/holidays"
        },
        { 
          id: "catalogs", 
          label: "Catálogos", 
          icon: Settings,
          endpoint: "/catalogs"
        }
      ]
    }
  ],
  
  admin: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Activity,
      items: [
        { id: "live-prices", label: "Precios en Vivo", icon: TrendingUp }
      ],
      defaultOpen: true
    },
    {
      id: "trading",
      label: "Trading",
      icon: BarChart3,
      items: [
        { 
          id: "position-mx", 
          label: "Posición MX", 
          icon: PieChart,
          endpoint: "/fx-operations/position-mx"
        },
        { 
          id: "spreads-trading", 
          label: "Spreads Trading", 
          icon: Settings,
          endpoint: "/spreads/trading"
        },
        { 
          id: "operations-trading", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations"
        }
      ]
    },
    {
      id: "sales",
      label: "Sales",
      icon: DollarSign,
      items: [
        { 
          id: "prices-sales", 
          label: "Cotizaciones", 
          icon: DollarSign,
          endpoint: "/currencies/pairs"
        },
        { 
          id: "spreads-sales", 
          label: "Spreads Ventas", 
          icon: Settings,
          endpoint: "/spreads/sales"
        },
        { 
          id: "spreads-exceptions", 
          label: "Spreads Excepción", 
          icon: AlertCircle,
          endpoint: "/spreads/exceptions"
        },
        { 
          id: "operations-sales", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations"
        }
      ]
    },
    {
      id: "middle",
      label: "Middle Office",
      icon: Users,
      items: [
        { 
          id: "clients", 
          label: "Clientes", 
          icon: Users,
          endpoint: "/clients"
        },
        { 
          id: "books", 
          label: "Libros", 
          icon: BookOpen,
          endpoint: "/operation-folders"
        },
        { 
          id: "currencies", 
          label: "Divisas", 
          icon: Coins,
          endpoint: "/currencies"
        },
        { 
          id: "users", 
          label: "Usuarios", 
          icon: UserCheck,
          endpoint: "/users"
        },
        { 
          id: "operations-middle", 
          label: "Operaciones", 
          icon: FileText,
          endpoint: "/fx-operations"
        }
      ]
    },
    {
      id: "administration",
      label: "Administración",
      icon: Shield,
      items: [
        { 
          id: "holidays", 
          label: "Feriados", 
          icon: Calendar,
          endpoint: "/holidays"
        },
        { 
          id: "catalogs", 
          label: "Catálogos", 
          icon: Settings,
          endpoint: "/catalogs"
        },
        { 
          id: "system-config", 
          label: "Configuración", 
          icon: Settings,
          endpoint: "/admin/config"
        }
      ]
    }
  ]
};

export const getNavigationForRole = (role: string): NavigationGroup[] => {
  return NAVIGATION_CONFIG[role] || NAVIGATION_CONFIG.trading;
};

export const getUserRole = (user: User): string => {
  if (user.profileName) {
    const profileRoleMap: Record<string, string> = {
      'Admin': 'admin',
      'Trader': 'trading',
      'Analyst': 'trading',
      'Sales': 'sales',
      'Manager': 'middle',
      'Supervisor': 'middle'
    };
    return profileRoleMap[user.profileName] || 'admin';
  }
  return user.role || 'admin';
};
