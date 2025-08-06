// forex-trading-app/app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
// ✅ IMPORTANTE: No importar AuthProvider aquí si es "use client"

export const metadata: Metadata = {
  title: 'PriceFlowFX - Forex Trading Platform',
  description: 'Real-time forex trading platform with live price feeds',
  generator: 'PriceFlowFX',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        {/* ✅ NO usar AuthProvider aquí - se usa en page.tsx */}
        {children}
      </body>
    </html>
  )
}