// forex-trading-app/app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { useAuth } from "@/contexts/AuthContext"

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [localUser, setLocalUser] = useState(null)
  const [isLocalAuth, setIsLocalAuth] = useState(false)

  useEffect(() => {
    // Check for existing local session (fallback)
    const savedUser = localStorage.getItem("forex-user")
    if (savedUser && !isAuthenticated) {
      setLocalUser(JSON.parse(savedUser))
      setIsLocalAuth(true)
    }
  }, [isAuthenticated])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando autenticación...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  const handleLogin = (userData: any) => {
    if (!isAuthenticated) {
      // Si no está autenticado con la API, usar sistema local
      setLocalUser(userData)
      setIsLocalAuth(true)
      localStorage.setItem("forex-user", JSON.stringify(userData))
    }
    // Si está autenticado con la API, el AuthContext ya maneja el estado
  }

  const handleLogout = () => {
    // Logout de la API si está autenticado
    if (isAuthenticated) {
      logout()
    }
    
    // Limpiar estado local
    setLocalUser(null)
    setIsLocalAuth(false)
    localStorage.removeItem("forex-user")
  }

  // Determinar qué usuario usar (API o local)
  const currentUser = isAuthenticated ? user : localUser
  const isCurrentlyAuthenticated = isAuthenticated || isLocalAuth

  return (
    <ThemeProvider>
      {!isCurrentlyAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <MainDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          isApiAuthenticated={isAuthenticated}
        />
      )}
    </ThemeProvider>
  )
}