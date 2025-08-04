"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, TrendingUp, Moon, Sun, Palette, Settings } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChangePasswordForm } from "@/components/auth/change-password-form"

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
  name: string
  email: string
  role: string
  permissions: string[]
}

interface MainDashboardProps {
  user: User
  onLogout: () => void
}

export function MainDashboard({ user, onLogout }: MainDashboardProps) {
  const { theme, style, setTheme, setStyle } = useTheme()
  const [showChangePassword, setShowChangePassword] = useState(false)

  const getModulesForRole = (role: string) => {
    switch (role) {
      case "trading":
        return [
          { id: "position-mx", label: "Posición MX", component: PositionMX },
          { id: "spread-trading", label: "Spreads Trading", component: TradingSpreadManager },
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
        ]
      case "sales":
        return [
          { id: "prices", label: "Precios", component: PricesModule },
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
          { id: "spread-sales", label: "Spreads Ventas", component: SalesSpreadManager },
          { id: "spread-exception", label: "Spreads Excepción", component: ExceptionSpreadManager },
        ]
      case "middle":
        return [
          { id: "operations", label: "Consulta Operaciones", component: OperationsQuery },
          { id: "clients", label: "Clientes", component: ClientsManager },
          { id: "holidays", label: "Feriados", component: HolidaysManager },
          { id: "books", label: "Libros", component: BooksManager },
          { id: "currencies", label: "Divisas", component: CurrenciesManager },
          { id: "users", label: "Usuarios", component: UsersManager },
        ]
      case "admin":
        return [
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
        return []
    }
  }

  const modules = getModulesForRole(user.role)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ForexTrade Institutional</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
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
      </div>
    </div>
  )
}
