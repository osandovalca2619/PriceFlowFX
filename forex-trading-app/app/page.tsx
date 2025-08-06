// forex-trading-app/app/page.tsx
"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/login-form"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"

// Componente interno que usa el AuthContext
function AppContent() {
  const { user, isAuthenticated, isLoading, logout, isApiAuthenticated } = useAuth()
  const [localUser, setLocalUser] = useState(null)
  const [isLocalAuth, setIsLocalAuth] = useState(false)

  useEffect(() => {
    // Check for existing local session (fallback) solo si no está autenticado con API
    if (!isAuthenticated) {
      const savedUser = localStorage.getItem("forex-user")
      const savedToken = localStorage.getItem("access_token")
      
      // Si hay un usuario guardado pero no hay token (o no está autenticado con API)
      if (savedUser && !savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser)
          console.log('Loading local user from localStorage:', parsedUser)
          setLocalUser(parsedUser)
          setIsLocalAuth(true)
        } catch (error) {
          console.error('Error parsing local user:', error)
          localStorage.removeItem("forex-user")
        }
      }
    } else {
      // Si está autenticado con API, limpiar estado local
      setLocalUser(null)
      setIsLocalAuth(false)
    }
  }, [isAuthenticated])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  const handleLogin = (userData: any) => {
    console.log('handleLogin called with:', userData)
    
    if (!isAuthenticated) {
      // Si no está autenticado con la API, usar sistema local
      console.log('Setting up local authentication for:', userData)
      setLocalUser(userData)
      setIsLocalAuth(true)
      localStorage.setItem("forex-user", JSON.stringify(userData))
    }
    // Si está autenticado con la API, el AuthContext ya maneja el estado
  }

  const handleLogout = () => {
    console.log('Logout requested')
    
    // Logout de la API si está autenticado
    if (isAuthenticated) {
      logout()
    }
    
    // Limpiar estado local
    setLocalUser(null)
    setIsLocalAuth(false)
    localStorage.removeItem("forex-user")
    
    console.log('Logout completed')
  }

  // Determinar qué usuario usar (API o local)
  const currentUser = isAuthenticated ? user : localUser
  const isCurrentlyAuthenticated = isAuthenticated || isLocalAuth

  // Debug: mostrar estado actual
  console.log('=== App State Debug ===')
  console.log('isAuthenticated (API):', isAuthenticated)
  console.log('isApiAuthenticated:', isApiAuthenticated)
  console.log('isLocalAuth:', isLocalAuth)
  console.log('isCurrentlyAuthenticated:', isCurrentlyAuthenticated)
  console.log('API user:', user)
  console.log('Local user:', localUser)
  console.log('Current user:', currentUser)
  console.log('=======================')

  // Verificar que tenemos un usuario válido antes de mostrar el dashboard
  if (isCurrentlyAuthenticated && !currentUser) {
    console.error('User is authenticated but currentUser is null')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p>Error: Usuario autenticado pero datos no disponibles</p>
            <button 
              onClick={handleLogout}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reiniciar Sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {!isCurrentlyAuthenticated || !currentUser ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <MainDashboard 
          user={currentUser} 
          onLogout={handleLogout}
          isApiAuthenticated={isAuthenticated} // Usar isAuthenticated en lugar de isApiAuthenticated
        />
      )}
    </>
  )
}

// Componente principal que provee el contexto
export default function HomePage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}