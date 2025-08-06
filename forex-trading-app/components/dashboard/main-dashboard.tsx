// forex-trading-app/components/dashboard/main-dashboard.tsx
"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, TrendingUp, Moon, Sun, Palette, Settings, Wifi, WifiOff, User } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChangePasswordForm } from "@/components/auth/change-password-form"
import PriceDashboard from "@/components/PriceDashboard"

// Trading modules
import { PositionMX } from "@/components/trading/position-mx"
import { OperationsQuery } from "@/components/shared/operations-query"
import { TradingSpreadManager } from "@/components/trading/trading-spread-manager"

// Sales modules
import { PricesModule } from "@/components/sales/prices-module"
import { SalesSpreadManager } from "@/components/sales/sales-spread-manager"
import { ExceptionSpreadManager } from "@/components/sales/exception-spread-manager"

// Middle modules
import { ClientsManager } from "@/components/middle/clients-manager"
import { HolidaysManager } from "@/components/middle/holidays-manager"
import { BooksManager } from "@/components/middle/books-manager"
import { CurrenciesManager } from "@/components/middle/currencies-manager"
import { UsersManager } from "@/components/middle/users-manager"

interface User {
  id: number
  name?: string
  fullName?: string
  username?: string
  email?: string
  role?: string
  profileId?: number
  profileName?: string
  salesGroupId?: number | null
  status?: string
  permissions?: string[]
}

interface MainDashboardProps {
  user: User
  onLogout: () => void
  isApiAuthenticated?: boolean
}

export function MainDashboard({ user, onLogout, isApiAuthenticated = false }: MainDashboardProps) {
  const { theme, style, setTheme, setStyle } = useTheme()
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Función helper para obtener el rol con fallback mejorado
  const getUserRole = (user: User): string => {
    // Prioridad: role > profileName mapeado > fallback
    //if (user.role) {
    //  return user.role
    //}
    
    // Si no hay role pero hay profileName, mapear
    if (user.profileName) {
      const profileRoleMap: Record<string, string> = {
        'Admin': 'admin',
        'Trader': 'trading', 
        'Analyst': 'trading',
        'Sales': 'sales',
        'Supervisor': 'middle',
        'Manager': 'middle',
        'Viewer': 'user',
        'Support': 'user'
      }
      return profileRoleMap[user.profileName] || 'admin'
    }
    else{
      return 'admin'
    }
   // return 'admin'
  
   // return 'admin'
  }

  // Función helper para obtener el nombre del usuario
  const getUserDisplayName = (user: User): string => {
    return user.name || user.fullName || user.username || user.email || 'Usuario'
  }

  // Función helper para formatear el nombre del perfil
  const getProfileDisplayName = (user: User): string => {
    if (user.profileName) {
      return user.profileName
    }
    
    // Mapear role a nombre de perfil si no existe profileName
    const roleProfileMap: Record<string, string> = {
      'admin': 'Administrador',
      'trading': 'Trader', 
      'sales': 'Ventas',
      'middle': 'Middle Office',
      'user': 'Usuario'
    }
    
    return roleProfileMap[user.role || 'user'] || 'Usuario'
  }

  const getModulesForRole = (role: string) => {
    const priceModule = { 
      id: "live-prices", 
      label: "Precios en Vivo", 
      component: () => <PriceDashboard />
    }

    switch (role) {
      case "trading":
        return [
          priceModule,
          { id: "position-mx", label: "Posición MX", component: PositionMX },
          { id: "spread-trading", label: "Spreads Trading", component: TradingSpreadManager },
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
        ]
      case "sales":
        return [
          priceModule,
          { id: "prices", label: "Precios", component: PricesModule },
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
          { id: "spread-sales", label: "Spreads Ventas", component: SalesSpreadManager },
          { id: "spread-exception", label: "Spreads Excepción", component: ExceptionSpreadManager },
        ]
      case "middle":
        return [
          priceModule,
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
          { id: "clients", label: "Clientes", component: ClientsManager },
          { id: "holidays", label: "Feriados", component: HolidaysManager },
          { id: "books", label: "Libros", component: BooksManager },
          { id: "currencies", label: "Divisas", component: CurrenciesManager },
          { id: "users", label: "Usuarios", component: UsersManager },
        ]
      case "admin":
        return [
          priceModule,
          { id: "position-mx", label: "Posición MX", component: PositionMX },
          { id: "spread-trading", label: "Spreads Trading", component: TradingSpreadManager },
          { id: "prices", label: "Precios", component: PricesModule },
          { id: "spread-sales", label: "Spreads Ventas", component: SalesSpreadManager },
          { id: "spread-exception", label: "Spreads Excepción", component: ExceptionSpreadManager },
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
          { id: "clients", label: "Clientes", component: ClientsManager },
          { id: "holidays", label: "Feriados", component: HolidaysManager },
          { id: "books", label: "Libros", component: BooksManager },
          { id: "currencies", label: "Divisas", component: CurrenciesManager },
          { id: "users", label: "Usuarios", component: UsersManager },
        ]
      default:
        return [priceModule]
    }
  }

  const userRole = getUserRole(user)
  const userDisplayName = getUserDisplayName(user)
  const profileDisplayName = getProfileDisplayName(user)
  const modules = getModulesForRole(userRole)

  // Debug: mostrar información del usuario en consola
  console.log('=== MainDashboard User Debug ===')
  console.log('Original user object:', user)
  console.log('Computed role:', userRole)
  console.log('Display name:', userDisplayName)
  console.log('Profile name:', profileDisplayName)
  console.log('Available modules:', modules.length)
  console.log('===================================')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">PriceFlowFX</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-gray-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {userDisplayName}
                  </p>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                    {profileDisplayName}
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                {/* Indicador de estado de autenticación */}
                <div className="flex items-center space-x-1">
                  {isApiAuthenticated ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">API</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-600 dark:text-orange-400">Local</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setStyle(style === "modern" ? "minimal" : "modern")}>
              <Palette className="h-4 w-4" />
            </Button>

            <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Contraseña</DialogTitle>
                </DialogHeader>
                <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {modules.length > 0 ? (
          <Tabs defaultValue={modules[0]?.id} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {modules.map((module) => (
                <TabsTrigger key={module.id} value={module.id} className="text-xs">
                  {module.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {modules.map((module) => (
              <TabsContent key={module.id} value={module.id}>
                {React.createElement(module.component, { user })}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No hay módulos disponibles para el rol: {userRole}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Usuario: {JSON.stringify(user, null, 2)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}