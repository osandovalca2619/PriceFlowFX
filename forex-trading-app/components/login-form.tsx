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
  const [username, setUsername] = useState("")  // Cambiado de email a username
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
      // Intentar login con la API usando username
      await login({ username, password })
      
      // Si el login es exitoso, el AuthContext ya maneja el estado del usuario
      onLogin({ username })
      
    } catch (error: any) {
      console.error("API Login failed:", error)
      // Si falla la API, mostrar opción de fallback
      setShowFallback(true)
    }
  }

  const handleFallbackLogin = () => {
    // Sistema de fallback para desarrollo/demo
    // Mapear usernames a usuarios locales
    const usernameToEmailMap: Record<string, string> = {
      "trader01": "trading@forex.com",
      "sales01": "sales@forex.com", 
      "manager01": "middle@forex.com",
      "admin": "admin@forex.com"
    }

    const users = {
      "trading@forex.com": {
        id: 1,
        name: "Juan Trading",
        email: "trading@forex.com",
        role: "trading",
        permissions: ["position-mx", "spread-trading", "operations-query"],
      },
      "sales@forex.com": {
        id: 2,
        name: "María Sales", 
        email: "sales@forex.com",
        role: "sales",
        permissions: ["prices", "operations-query", "spread-sales", "spread-exception"],
      },
      "middle@forex.com": {
        id: 3,
        name: "Carlos Middle Office",
        email: "middle@forex.com", 
        role: "middle",
        permissions: ["operations-query", "clients", "holidays", "books", "currencies", "users"],
      },
      "admin@forex.com": {
        id: 4,
        name: "Ana Administrador",
        email: "admin@forex.com",
        role: "admin", 
        permissions: ["all"],
      },
    }

    // Buscar por username o email
    const emailFromUsername = usernameToEmailMap[username]
    const userByEmail = emailFromUsername ? users[emailFromUsername as keyof typeof users] : null
    const userByDirectEmail = users[username as keyof typeof users]
    
    const user = userByEmail || userByDirectEmail

    if (user && password === "123456") {
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
              <p><strong>API:</strong> trader01, sales01, manager01, admin</p>
              <p><strong>Local:</strong> trading@forex.com, sales@forex.com, middle@forex.com, admin@forex.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}