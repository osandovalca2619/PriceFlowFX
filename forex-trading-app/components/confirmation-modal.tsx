"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface CurrencyPrice {
  id: string
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  lastUpdate: string
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  price: CurrencyPrice | null
  tradeType: "buy" | "sell"
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, price, tradeType }: ConfirmationModalProps) {
  const [timeLeft, setTimeLeft] = useState(5)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(5)
      setIsExpired(false)

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true)
            clearInterval(timer)
            setTimeout(() => onClose(), 1000)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen, onClose])

  if (!price) return null

  const currentPrice = tradeType === "buy" ? price.ask : price.bid
  const progressValue = ((5 - timeLeft) / 5) * 100

  const handleConfirm = () => {
    if (!isExpired) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center space-x-2">
            {tradeType === "buy" ? (
              <TrendingUp className="h-5 w-5 text-blue-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span>Confirmar Operación</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-center">
          {/* Countdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-2xl font-bold text-gray-900">{timeLeft}s</span>
            </div>
            <Progress value={progressValue} className="w-full" />
            {isExpired && <p className="text-red-600 text-sm font-medium">Tiempo agotado - Operación cancelada</p>}
          </div>

          {/* Operation Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Par:</span>
                <span className="font-medium">{price.pair}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className={`font-medium ${tradeType === "buy" ? "text-blue-600" : "text-red-600"}`}>
                  {tradeType === "buy" ? "COMPRA" : "VENTA"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Precio:</span>
                <span className="font-mono font-bold">{currentPrice.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isExpired}
              className={`flex-1 ${
                tradeType === "buy" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
              } ${isExpired ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isExpired ? "Expirado" : "Confirmar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
