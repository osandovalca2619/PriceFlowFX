"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp } from "lucide-react"

interface LoginFormProps {
  onLogin: (userData: any) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      const users = {
        "ventas@forex.com": { id: 1, name: "Usuario Ventas", email: "ventas@forex.com", role: "ventas" },
        "trading@forex.com": { id: 2, name: "Usuario Trading", email: "trading@forex.com", role: "trading" },
        "consultas@forex.com": { id: 3, name: "Usuario Consultas", email: "consultas@forex.com", role: "consultas" },
        "admin@forex.com": { id: 4, name: "Administrador", email: "admin@forex.com", role: "administrador" },
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">ForexTrade Pro</CardTitle>
          <CardDescription>Accede a tu plataforma de trading de divisas</CardDescription>
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
                placeholder="tu@email.com"
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
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-medium">Credenciales de prueba (contraseña: 123456):</p>
            <p>Ventas: ventas@forex.com</p>
            <p>Trading: trading@forex.com</p>
            <p>Consultas: consultas@forex.com</p>
            <p>Admin: admin@forex.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
