"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrendingUp, Settings, Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { ChangePasswordForm } from "./change-password-form"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const { theme, style, setTheme, setStyle } = useTheme()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
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

      if (users[email] && password === "123456") {
        onLogin(users[email])
      } else {
        setError("Credenciales inválidas")
      }
      setLoading(false)
    }, 1000)
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
          <CardTitle className="text-2xl font-bold">ForexTrade Institutional</CardTitle>
          <CardDescription>Plataforma de Trading de Divisas</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@forex.com"
                required
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
              />
            </div>
            {error && (
              <Alert variant="destructive">
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

            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">Credenciales de prueba (contraseña: 123456):</p>
              <div className="mt-2 space-y-1">
                <p>Trading: trading@forex.com</p>
                <p>Sales: sales@forex.com</p>
                <p>Middle Office: middle@forex.com</p>
                <p>Admin: admin@forex.com</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
