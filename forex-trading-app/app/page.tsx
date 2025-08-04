"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { ThemeProvider } from "@/components/theme/theme-provider"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("forex-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("forex-user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("forex-user")
  }

  return (
    <ThemeProvider>
      {!isAuthenticated ? <LoginForm onLogin={handleLogin} /> : <MainDashboard user={user} onLogout={handleLogout} />}
    </ThemeProvider>
  )
}
