// forex-trading-app/contexts/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ApiUser {
  id: number
  username: string
  fullName: string
  profileId: number
  profileName: string  // Viene de la API
  salesGroupId: number | null
  status: string
}

interface FrontendUser {
  id: number
  name?: string
  fullName?: string
  username?: string
  email?: string
  role?: string        // Para el frontend
  profileId?: number
  profileName?: string
  salesGroupId?: number | null
  status?: string
  permissions?: string[]
}

interface AuthContextType {
  user: FrontendUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
  clearError: () => void
  isApiAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mapear profileName de la API a roles del frontend
const mapProfileToRole = (profileName: string): string => {
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
  
  return profileRoleMap[profileName] || 'user'
}

// Convertir usuario de API a formato frontend
const convertApiUserToFrontendUser = (apiUser: ApiUser): FrontendUser => {
  const role = mapProfileToRole(apiUser.profileName)
  
  return {
    id: apiUser.id,
    name: apiUser.fullName,
    fullName: apiUser.fullName,
    username: apiUser.username,
    email: `${apiUser.username}@forex.com`, // Generar email si no existe
    role: role,
    profileId: apiUser.profileId,
    profileName: apiUser.profileName,
    salesGroupId: apiUser.salesGroupId,
    status: apiUser.status,
    permissions: getPermissionsForRole(role)
  }
}

// Obtener permisos basados en el rol
const getPermissionsForRole = (role: string): string[] => {
  const rolePermissions: Record<string, string[]> = {
    'admin': ['all'],
    'trading': ['position-mx', 'spread-trading', 'operations-query'],
    'sales': ['prices', 'operations-query', 'spread-sales', 'spread-exception'],
    'middle': ['operations-query', 'clients', 'holidays', 'books', 'currencies', 'users'],
    'user': ['operations-query']
  }
  
  return rolePermissions[role] || ['operations-query']
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FrontendUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isApiAuthenticated, setIsApiAuthenticated] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('forex-user')
      const savedToken = localStorage.getItem('access_token')
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsApiAuthenticated(!!savedToken)
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem('forex-user')
          localStorage.removeItem('access_token')
        }
      }
    }
    
    checkAuth()
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      // Intentar login con API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('API Login successful:', data)
        
        // Convertir usuario de API a formato frontend
        const frontendUser = convertApiUserToFrontendUser(data.user)
        
        // Guardar datos
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('forex-user', JSON.stringify(frontendUser))
        
        setUser(frontendUser)
        setIsApiAuthenticated(true)
        
        console.log('User data converted for frontend:', frontendUser)
        
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('API Login error:', error)
      setIsApiAuthenticated(false)
      setError(error.message || 'Error de conexión con la API')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('forex-user')
    localStorage.removeItem('access_token')
    setUser(null)
    setIsApiAuthenticated(false)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    clearError,
    isApiAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}