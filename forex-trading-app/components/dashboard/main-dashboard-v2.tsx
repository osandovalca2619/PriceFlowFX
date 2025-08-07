// components/dashboard/main-dashboard-v2.tsx
"use client"

import React from "react"
import { AppShell } from "@/components/layout/AppShell"
import { ThemeProvider } from "@/components/theme/theme-provider"

interface User {
  id: number
  name?: string
  fullName?: string
  username?: string
  email?: string
  role?: string
  profileId?: number
  profileName?: string
  salesGroupId?: number | null
  status?: string
  permissions?: string[]
}

interface MainDashboardV2Props {
  user: User
  onLogout: () => void
  isApiAuthenticated?: boolean
}

export function MainDashboardV2({ user, onLogout, isApiAuthenticated = false }: MainDashboardV2Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AppShell
        user={user}
        onLogout={onLogout}
        isApiAuthenticated={isApiAuthenticated}
      />
    </ThemeProvider>
  )
}
