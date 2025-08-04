"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, TrendingDown, Clock } from "lucide-react"
import { SpotTicketModal } from "@/components/shared/spot-ticket-modal"

interface CurrencyPrice {
  id: string
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  lastUpdate: string
  enabled: boolean
}

interface QuoteOperation {
  id: string
  pair: string
  type: "buy" | "sell"
  amount: number
  quotedPrice: number
  timestamp: string
  status: "pending" | "confirmed" | "expired"
}

export function PricesModule({ user }) {
  const [priceCards, setPriceCards] = useState<CurrencyPrice[]>([
    {
      id: "1",
      pair: "EUR/USD",
      bid: 1.0845,
      ask: 1.0847,
      spread: 0.0002,
      change: 0.12,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
    {
      id: "2",
      pair: "GBP/USD",
      bid: 1.2634,
      ask: 1.2637,
      spread: 0.0003,
      change: -0.08,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
    {
      id: "3",
      pair: "USD/JPY",
      bid: 149.85,
      ask: 149.88,
      spread: 0.03,
      change: 0.25,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
    {
      id: "4",
      pair: "AUD/USD",
      bid: 0.6542,
      ask: 0.6545,
      spread: 0.0003,
      change: -0.15,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
    {
      id: "5",
      pair: "USD/CAD",
      bid: 1.3678,
      ask: 1.3681,
      spread: 0.0003,
      change: 0.05,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
    {
      id: "6",
      pair: "USD/CHF",
      bid: 0.8756,
      ask: 0.8759,
      spread: 0.0003,
      change: 0.18,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    },
  ])

  const [pendingOperations, setPendingOperations] = useState<QuoteOperation[]>([])
  const [selectedPrice, setSelectedPrice] = useState<CurrencyPrice | null>(null)
  const [selectedOperation, setSelectedOperation] = useState<QuoteOperation | null>(null)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [quoteAmount, setQuoteAmount] = useState("")
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountdownActive, setIsCountdownActive] = useState(false)

  // Real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceCards((prev) =>
        prev.map((price) => ({
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

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCountdownActive && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    } else if (countdown === 0) {
      handleQuoteExpired()
    }
    return () => clearTimeout(timer)
  }, [isCountdownActive, countdown])

  const handlePriceClick = (price: CurrencyPrice, type: "buy" | "sell") => {
    setSelectedPrice(price)
    setTradeType(type)
    setQuoteAmount("")
    setIsQuoteModalOpen(true)
  }

  const handleQuoteSubmit = () => {
    if (!selectedPrice || !quoteAmount) return

    const amount = Number.parseFloat(quoteAmount)
    const basePrice = tradeType === "buy" ? selectedPrice.ask : selectedPrice.bid
    const quotedPrice = basePrice // In real app, this would include spread calculations

    setCountdown(5)
    setIsCountdownActive(true)
  }

  const handleQuoteConfirm = () => {
    if (!selectedPrice || !quoteAmount) return

    const newOperation: QuoteOperation = {
      id: Date.now().toString(),
      pair: selectedPrice.pair,
      type: tradeType,
      amount: Number.parseFloat(quoteAmount),
      quotedPrice: tradeType === "buy" ? selectedPrice.ask : selectedPrice.bid,
      timestamp: new Date().toISOString(),
      status: "confirmed",
    }

    setPendingOperations((prev) => [...prev, newOperation])
    setIsQuoteModalOpen(false)
    setIsCountdownActive(false)
    setCountdown(5)
  }

  const handleQuoteExpired = () => {
    setIsCountdownActive(false)
    setCountdown(5)
    // Could show expiration message
  }

  const handleOperationClick = (operation: QuoteOperation) => {
    setSelectedOperation(operation)
    setIsTicketModalOpen(true)
  }

  const handleTicketComplete = (ticketData: any) => {
    // Remove from pending and add to completed operations
    setPendingOperations((prev) => prev.filter((op) => op.id !== selectedOperation?.id))
    setIsTicketModalOpen(false)
    console.log("Operation completed:", ticketData)
  }

  const addNewPriceCard = () => {
    const newCard: CurrencyPrice = {
      id: Date.now().toString(),
      pair: "NEW/PAIR",
      bid: 1.0,
      ask: 1.0002,
      spread: 0.0002,
      change: 0,
      lastUpdate: new Date().toLocaleTimeString(),
      enabled: true,
    }
    setPriceCards((prev) => [...prev, newCard])
  }

  const enabledCards = priceCards.filter((card) => card.enabled)
  const cardsPerRow = 4
  const maxRows = 2

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Configuración de Precios</span>
            <Button onClick={addNewPriceCard}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Par
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {enabledCards.length} pares de divisas ({cardsPerRow} por fila, máximo {maxRows} filas)
          </p>
        </CardContent>
      </Card>

      {/* Price Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enabledCards.slice(0, cardsPerRow * maxRows).map((price) => (
          <Card key={price.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{price.pair}</h3>
                <div
                  className={`flex items-center justify-center mt-1 ${price.change >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {price.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{price.change.toFixed(2)}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compra</span>
                  <Button
                    onClick={() => handlePriceClick(price, "buy")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-mono"
                  >
                    {price.ask.toFixed(4)}
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Venta</span>
                  <Button
                    onClick={() => handlePriceClick(price, "sell")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-mono"
                  >
                    {price.bid.toFixed(4)}
                  </Button>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Spread: {price.spread.toFixed(4)}</span>
                    <span>{price.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Operations */}
      {pendingOperations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Operaciones Pendientes ({pendingOperations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Par</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Precio Cotizado</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-medium">{operation.pair}</TableCell>
                    <TableCell>
                      <Badge variant={operation.type === "buy" ? "default" : "destructive"}>
                        {operation.type === "buy" ? "COMPRA" : "VENTA"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">${operation.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono">{operation.quotedPrice.toFixed(4)}</TableCell>
                    <TableCell className="text-sm">{new Date(operation.timestamp).toLocaleTimeString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">PENDIENTE</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleOperationClick(operation)}>
                        Completar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Quote Modal */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {tradeType === "buy" ? (
                <TrendingUp className="h-5 w-5 text-blue-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <span>Cotizar {selectedPrice?.pair}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monto</label>
              <Input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
                placeholder="100000"
              />
            </div>

            {quoteAmount && selectedPrice && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tipo:</span>
                    <Badge variant={tradeType === "buy" ? "default" : "destructive"}>
                      {tradeType === "buy" ? "COMPRA" : "VENTA"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Precio:</span>
                    <span className="font-mono font-bold">
                      {(tradeType === "buy" ? selectedPrice.ask : selectedPrice.bid).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total:</span>
                    <span className="font-mono font-bold">
                      $
                      {(
                        Number.parseFloat(quoteAmount) * (tradeType === "buy" ? selectedPrice.ask : selectedPrice.bid)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {isCountdownActive && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{countdown}s</span>
                </div>
                <Progress value={((5 - countdown) / 5) * 100} className="w-full" />
                <p className="text-sm text-center text-gray-600">Tiempo para confirmar cotización</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsQuoteModalOpen(false)}
                className="flex-1"
                disabled={isCountdownActive}
              >
                Cancelar
              </Button>
              {!isCountdownActive ? (
                <Button onClick={handleQuoteSubmit} className="flex-1" disabled={!quoteAmount}>
                  Cotizar
                </Button>
              ) : (
                <Button onClick={handleQuoteConfirm} className="flex-1">
                  Confirmar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spot Ticket Modal */}
      <SpotTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        operation={selectedOperation}
        onComplete={handleTicketComplete}
        userRole={user.role}
      />
    </div>
  )
}
