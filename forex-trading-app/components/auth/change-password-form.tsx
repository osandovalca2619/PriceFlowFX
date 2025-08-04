"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ChangePasswordFormProps {
  onClose: () => void
}

export function ChangePasswordForm({ onClose }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    // Simulate password change
    setTimeout(() => {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <Alert>
        <AlertDescription>Contraseña cambiada exitosamente</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current">Contraseña Actual</Label>
        <Input
          id="current"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new">Nueva Contraseña</Label>
        <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirmar Nueva Contraseña</Label>
        <Input
          id="confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1">
          Cambiar
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
