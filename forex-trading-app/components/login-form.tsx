// forex-trading-app/components/login-form.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const { login, error: authError, isLoading, clearError } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")
  const [showFallback, setShowFallback] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    clearError()

    // Validaciones básicas
    if (!username || !password) {
      setLocalError("Por favor, completa todos los campos")
      return
    }

    try {
      // Intentar login con la API
      await login({ username, password })
      
      // Si el login es exitoso, el AuthContext ya maneja la conversión del usuario
      console.log('Login successful, calling onLogin...')
      onLogin({ username }) // El usuario real se maneja en el AuthContext
      
    } catch (error: any) {
      console.error("API Login failed:", error)
      setShowFallback(true)
    }
  }

  const handleFallbackLogin = () => {
    // Sistema de fallback mejorado que mantiene consistencia con la API
    const usernameToUserMap: Record<string, any> = {
      "trader01": {
        id: 1,
        name: "Juan Trading",
        fullName: "Juan Trading",
        username: "trader01",
        email: "trading@forex.com",
        role: "trading",
        profileId: 2,
        profileName: "Trader",
        permissions: ["position-mx", "spread-trading", "operations-query"],
      },
      "sales01": {
        id: 2,
        name: "María Sales", 
        fullName: "María Sales",
        username: "sales01",
        email: "sales@forex.com",
        role: "sales",
        profileId: 5,
        profileName: "Sales",
        permissions: ["prices", "operations-query", "spread-sales", "spread-exception"],
      },
      "manager01": {
        id: 3,
        name: "Carlos Middle Office",
        fullName: "Carlos Middle Office",
        username: "manager01",
        email: "middle@forex.com", 
        role: "middle",
        profileId: 6,
        profileName: "Manager",
        permissions: ["operations-query", "clients", "holidays", "books", "currencies", "users"],
      },
      "admin": {
        id: 4,
        name: "Ana Administrador",
        fullName: "Ana Administrador",
        username: "admin",
        email: "admin@forex.com",
        role: "admin",
        profileId: 1,
        profileName: "Admin",
        permissions: ["all"],
      },
      // También permitir login por email (compatibilidad hacia atrás)
      "trading@forex.com": {
        id: 1,
        name: "Juan Trading",
        fullName: "Juan Trading",
        username: "trader01",
        email: "trading@forex.com",
        role: "trading",
        profileId: 2,
        profileName: "Trader",
        permissions: ["position-mx", "spread-trading", "operations-query"],
      },
      "sales@forex.com": {
        id: 2,
        name: "María Sales", 
        fullName: "María Sales",
        username: "sales01",
        email: "sales@forex.com",
        role: "sales",
        profileId: 5,
        profileName: "Sales",
        permissions: ["prices", "operations-query", "spread-sales", "spread-exception"],
      },
      "middle@forex.com": {
        id: 3,
        name: "Carlos Middle Office",
        fullName: "Carlos Middle Office",
        username: "manager01",
        email: "middle@forex.com", 
        role: "middle",
        profileId: 6,
        profileName: "Manager",
        permissions: ["operations-query", "clients", "holidays", "books", "currencies", "users"],
      },
      "admin@forex.com": {
        id: 4,
        name: "Ana Administrador",
        fullName: "Ana Administrador",
        username: "admin",
        email: "admin@forex.com",
        role: "admin",
        profileId: 1,
        profileName: "Admin",
        permissions: ["all"],
      },
    }

    const user = usernameToUserMap[username]

    if (user && password === "123456") {
      console.log('Fallback login successful for user:', user)
      onLogin(user)
      localStorage.setItem("forex-user", JSON.stringify(user))
    } else {
      setLocalError("Credenciales inválidas para el sistema local")
    }
  }

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') {
      setUsername(value)
    } else {
      setPassword(value)
    }
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (localError) setLocalError("")
    if (authError) clearError()
    if (showFallback) setShowFallback(false)
  }

  // Combinar errores locales y del contexto
  const displayError = localError || authError

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">PriceFlowFX</CardTitle>
          <CardDescription>Accede a tu plataforma de trading de divisas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="tu_usuario o email@forex.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Conectando con API..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Mostrar fallback si la API falla */}
          {showFallback && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 mb-3">
                No se pudo conectar con la API. ¿Deseas usar el sistema local?
              </p>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleFallbackLogin} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  Usar Sistema Local
                </Button>
                <Button 
                  onClick={() => setShowFallback(false)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  Reintentar API
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-sm text-gray-600">
            <div className="mb-3">
              <p className="font-medium">🌐 API Backend:</p>
              <p className="text-xs text-gray-500">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
              </p>
            </div>
            
            <p className="font-medium">Credenciales de prueba (contraseña: 123456):</p>
            <div className="mt-2 space-y-1 text-xs">
              <p><strong>API/Local:</strong> trader01, sales01, manager01, admin</p>
              <p><strong>Perfiles:</strong> Trader → trading, Sales → sales, Manager → middle, Admin → admin</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}