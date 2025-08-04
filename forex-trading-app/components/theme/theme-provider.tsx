"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark"
type Style = "modern" | "minimal"

interface ThemeContextType {
  theme: Theme
  style: Style
  setTheme: (theme: Theme) => void
  setStyle: (style: Style) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [style, setStyle] = useState<Style>("modern")

  useEffect(() => {
    const savedTheme = localStorage.getItem("forex-theme") as Theme
    const savedStyle = localStorage.getItem("forex-style") as Style

    if (savedTheme) setTheme(savedTheme)
    if (savedStyle) setStyle(savedStyle)
  }, [])

  useEffect(() => {
    localStorage.setItem("forex-theme", theme)
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    localStorage.setItem("forex-style", style)
    document.documentElement.classList.toggle("minimal", style === "minimal")
  }, [style])

  return (
    <ThemeContext.Provider value={{ theme, style, setTheme, setStyle }}>
      <div className={`${theme} ${style}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
