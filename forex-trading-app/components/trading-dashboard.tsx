"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, TrendingUp } from "lucide-react"
import { PriceCards } from "@/components/price-cards"
import { PendingOperations } from "@/components/pending-operations"
import { AllOperations } from "@/components/all-operations"
import { UsdPosition } from "@/components/usd-position"
import { SpreadManagement } from "@/components/spread-management"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { SpotModal } from "@/components/spot-modal"

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface TradingDashboardProps {
  user: User
  onLogout: () => void
}

interface CurrencyPrice {
  id: string
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  lastUpdate: string
}

interface PendingOperation {
  id: string
  pair: string
  type: "buy" | "sell"
  price: number
  timestamp: string
  status: "pending"
}

interface CompletedOperation {
  id: string
  pair: string
  type: "buy" | "sell"
  tradingBook: string
  salesBook: string
  amount: number
  costPrice: number
  clientPrice: number
  margin: number
  profit: number
  equivalentAmount: number
  operationDate: string
  client: {
    rut: string
    name: string
    codigoOrigen: string
  }
  comments: string
  status: "completed" | "cancelled"
}

export function TradingDashboard({ user, onLogout }: TradingDashboardProps) {
  const [prices, setPrices] = useState<CurrencyPrice[]>([
    {
      id: "1",
      pair: "EUR/USD",
      bid: 1.0845,
      ask: 1.0847,
      spread: 0.0002,
      change: 0.12,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      id: "2",
      pair: "GBP/USD",
      bid: 1.2634,
      ask: 1.2637,
      spread: 0.0003,
      change: -0.08,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      id: "3",
      pair: "USD/JPY",
      bid: 149.85,
      ask: 149.88,
      spread: 0.03,
      change: 0.25,
      lastUpdate: new Date().toLocaleTimeString(),
    },
    {
      id: "4",
      pair: "AUD/USD",
      bid: 0.6542,
      ask: 0.6545,
      spread: 0.0003,
      change: -0.15,
      lastUpdate: new Date().toLocaleTimeString(),
    },
  ])

  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([])
  const [completedOperations, setCompletedOperations] = useState<CompletedOperation[]>([])
  const [selectedPrice, setSelectedPrice] = useState<CurrencyPrice | null>(null)
  const [selectedOperation, setSelectedOperation] = useState<PendingOperation | CompletedOperation | null>(null)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isSpotModalOpen, setIsSpotModalOpen] = useState(false)

  // Simulación de precios en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prevPrices) =>
        prevPrices.map((price) => ({
          ...price,
          bid: price.bid + (Math.random() - 0.5) * 0.001,
          ask: price.ask + (Math.random() - 0.5) * 0.001,
          change: (Math.random() - 0.5) * 0.5,
          lastUpdate: new Date().toLocaleTimeString(),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handlePriceClick = (price: CurrencyPrice, type: "buy" | "sell") => {
    setSelectedPrice(price)
    setTradeType(type)
    setIsConfirmationOpen(true)
  }

  const handleConfirmOperation = () => {
    if (selectedPrice) {
      const newOperation: PendingOperation = {
        id: Date.now().toString(),
        pair: selectedPrice.pair,
        type: tradeType,
        price: tradeType === "buy" ? selectedPrice.ask : selectedPrice.bid,
        timestamp: new Date().toISOString(),
        status: "pending",
      }
      setPendingOperations((prev) => [...prev, newOperation])
    }
    setIsConfirmationOpen(false)
  }

  const handlePendingOperationClick = (operation: PendingOperation) => {
    setSelectedOperation(operation)
    setIsSpotModalOpen(true)
  }

  const handleCompletedOperationClick = (operation: CompletedOperation) => {
    setSelectedOperation(operation)
    setIsSpotModalOpen(true)
  }

  const handleCompleteOperation = (operationData: any) => {
    if (selectedOperation && "status" in selectedOperation && selectedOperation.status === "pending") {
      const completedOperation: CompletedOperation = {
        id: selectedOperation.id,
        pair: selectedOperation.pair,
        type: selectedOperation.type,
        ...operationData,
        status: "completed",
      }
      setCompletedOperations((prev) => [...prev, completedOperation])
      setPendingOperations((prev) => prev.filter((op) => op.id !== selectedOperation.id))
    }
    setIsSpotModalOpen(false)
  }

  const getTabsForRole = (role: string) => {
    const baseTabs = [{ value: "trading", label: "Trading", component: PriceCards }]

    switch (role) {
      case "ventas":
        return [...baseTabs, { value: "operations", label: "Operaciones", component: AllOperations }]
      case "trading":
        return [
          ...baseTabs,
          { value: "operations", label: "Operaciones", component: AllOperations },
          { value: "position", label: "Posición USD", component: UsdPosition },
          { value: "spreads", label: "Spreads", component: SpreadManagement },
        ]
      case "consultas":
        return [
          { value: "operations", label: "Consulta Operaciones", component: AllOperations },
          { value: "position", label: "Posición USD", component: UsdPosition },
        ]
      case "administrador":
        return [
          ...baseTabs,
          { value: "operations", label: "Operaciones", component: AllOperations },
          { value: "position", label: "Posición USD", component: UsdPosition },
          { value: "spreads", label: "Spreads", component: SpreadManagement },
        ]
      default:
        return baseTabs
    }
  }

  const tabs = getTabsForRole(user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ForexTrade Pro</h1>
              <p className="text-sm text-gray-600">
                {user.name} - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue={tabs[0].value} className="space-y-6">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="trading">
            <div className="space-y-6">
              <PriceCards prices={prices} onPriceClick={handlePriceClick} />
              <PendingOperations operations={pendingOperations} onOperationClick={handlePendingOperationClick} />
            </div>
          </TabsContent>

          <TabsContent value="operations">
            <AllOperations operations={completedOperations} onOperationClick={handleCompletedOperationClick} />
          </TabsContent>

          <TabsContent value="position">
            <UsdPosition operations={completedOperations} />
          </TabsContent>

          <TabsContent value="spreads">
            <SpreadManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmOperation}
        price={selectedPrice}
        tradeType={tradeType}
      />

      <SpotModal
        isOpen={isSpotModalOpen}
        onClose={() => setIsSpotModalOpen(false)}
        operation={selectedOperation}
        onComplete={handleCompleteOperation}
        userRole={user.role}
      />
    </div>
  )
}
