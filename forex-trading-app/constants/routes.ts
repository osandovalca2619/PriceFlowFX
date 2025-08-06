// constants/routes.ts
export const ROUTE_MODULES = {
  'live-prices': {
    path: '/dashboard/prices',
    component: 'PriceDashboard'
  },
  'position-mx': {
    path: '/trading/position',
    component: 'PositionMXDashboard'
  },
  'spreads-trading': {
    path: '/trading/spreads',
    component: 'TradingSpreadManager'
  },
  'operations-trading': {
    path: '/trading/operations',
    component: 'OperationsQuery'
  },
  'prices-sales': {
    path: '/sales/prices',
    component: 'PricesModule'
  },
  'spreads-sales': {
    path: '/sales/spreads',
    component: 'SalesSpreadManager'
  },
  'spreads-exceptions': {
    path: '/sales/exceptions',
    component: 'ExceptionSpreadManager'
  },
  'operations-sales': {
    path: '/sales/operations',
    component: 'OperationsQuery'
  },
  'clients': {
    path: '/middle/clients',
    component: 'ClientsManager'
  },
  'books': {
    path: '/middle/books',
    component: 'BooksManager'
  },
  'currencies': {
    path: '/middle/currencies',
    component: 'CurrenciesManager'
  },
  'users': {
    path: '/middle/users',
    component: 'UsersManager'
  },
  'operations-middle': {
    path: '/middle/operations',
    component: 'OperationsQuery'
  },
  'holidays': {
    path: '/middle/holidays',
    component: 'HolidaysManager'
  },
  'catalogs': {
    path: '/admin/catalogs',
    component: 'CatalogsManager'
  }
} as const;

export type ModuleId = keyof typeof ROUTE_MODULES;