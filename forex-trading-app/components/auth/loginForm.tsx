"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, Settings, Moon, Sun, Palette, AlertCircle } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { ChangePasswordForm } from "./change-password-form"
import { authService } from "@/lib/api/authService"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { theme, style, setTheme, setStyle } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Intentar login con la API real
      const response = await authService.login({ username, password })
      
      // Mapear la respuesta de la API al formato esperado por tu app
      const userData = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.username, // Usar username como email temporalmente
        role: getUserRole(response.user.profileId),
        permissions: getUserPermissions(response.user.profileId),
        profileId: response.user.profileId,
        salesGroupId: response.user.salesGroupId,
        status: response.user.status,
        token: response.access_token
      }

      onLogin(userData)
    } catch (error: any) {
      console.error('Error en login:', error)
      setError(error.message || 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  // Función para mapear profileId a rol (basado en tu base de datos)
  const getUserRole = (profileId: number): string => {
    const roleMapping: Record<number, string> = {
      1: 'admin',      // Administrador
      2: 'trading',    // Trader
      3: 'sales',      // Sales
      4: 'viewer',     // Viewer
      5: 'middle',     // Manager
    }
    return roleMapping[profileId] || 'viewer'
  }

  // Función para mapear profileId a permisos
  const getUserPermissions = (profileId: number): string[] => {
    const permissionMapping: Record<number, string[]> = {
      1: ['all'], // Admin - todos los permisos
      2: ['position-mx', 'spread-trading', 'operations-query'], // Trader
      3: ['prices', 'operations-query', 'spread-sales', 'spread-exception'], // Sales
      4: ['operations-query'], // Viewer - solo consultas
      5: ['operations-query', 'clients', 'holidays', 'books', 'currencies', 'users'], // Manager
    }
    return permissionMapping[profileId] || ['operations-query']
  }

  // Datos de ejemplo para desarrollo (mantener hasta migración completa)
  const getDemoCredentials = () => [
    { display: 'Admin: admin / admin123!', username: 'admin', password: 'admin123!' },
    { display: 'Trader: trader01 / trader123!', username: 'trader01', password: 'trader123!' },
    { display: 'Sales: sales01 / sales123!', username: 'sales01', password: 'sales123!' },
    { display: 'Manager: manager01 / manager123!', username: 'manager01', password: 'manager123!' },
    { display: 'Viewer: viewer01 / viewer123!', username: 'viewer01', password: 'viewer123!' },
  ]

  const fillDemoCredentials = (username: string, password: string) => {
    setUsername(username)
    setPassword(password)
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="bg-white/80 dark:bg-gray-800/80"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStyle(style === "modern" ? "minimal" : "modern")}
          className="bg-white/80 dark:bg-gray-800/80"
        >
          <Palette className="h-4 w-4" />
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">PriceFlowFX</CardTitle>
          <CardDescription>Plataforma Institucional de Trading FX</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Contraseña</DialogTitle>
                </DialogHeader>
                <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
              </DialogContent>
            </Dialog>

            {/* Credenciales de desarrollo */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">🔧 Credenciales de desarrollo:</p>
              <div className="space-y-1">
                {getDemoCredentials().map((cred, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillDemoCredentials(cred.username, cred.password)}
                    className="block w-full text-left text-xs hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {cred.display}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2 text-gray-500">
                💡 Click en cualquier credencial para autocompletar
              </p>
            </div>

            {/* Status de la API */}
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}