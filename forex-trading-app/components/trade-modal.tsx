"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, TrendingDown, Calculator } from "lucide-react"

interface CurrencyPrice {
  id: string
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  lastUpdate: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  price: CurrencyPrice | null
  tradeType: "buy" | "sell"
  user: User
}

export function TradeModal({ isOpen, onClose, price, tradeType, user }: TradeModalProps) {
  const [amount, setAmount] = useState("")
  const [leverage, setLeverage] = useState("1:100")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [clientId, setClientId] = useState("")
  const [notes, setNotes] = useState("")

  if (!price) return null

  const currentPrice = tradeType === "buy" ? price.ask : price.bid
  const calculatedValue = Number.parseFloat(amount) * currentPrice || 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tradeData = {
      pair: price.pair,
      type: tradeType,
      amount: Number.parseFloat(amount),
      price: currentPrice,
      leverage,
      stopLoss: Number.parseFloat(stopLoss),
      takeProfit: Number.parseFloat(takeProfit),
      clientId,
      notes,
      timestamp: new Date().toISOString(),
      userId: user.id,
    }

    console.log("Nueva operación:", tradeData)

    // Aquí integrarías con tu backend
    alert(`Operación ${tradeType === "buy" ? "de compra" : "de venta"} registrada exitosamente`)
    onClose()

    // Reset form
    setAmount("")
    setLeverage("1:100")
    setStopLoss("")
    setTakeProfit("")
    setClientId("")
    setNotes("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {tradeType === "buy" ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span>
              {tradeType === "buy" ? "Comprar" : "Vender"} {price.pair}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Price Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{price.pair}</span>
              <Badge variant={tradeType === "buy" ? "default" : "destructive"}>
                {tradeType === "buy" ? "COMPRA" : "VENTA"}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Precio:</span>
              <span className="font-mono font-bold">{currentPrice.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Spread:</span>
              <span className="font-mono">{price.spread.toFixed(4)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Cantidad (Lotes)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.00"
                required
              />
            </div>

            {/* Leverage */}
            <div className="space-y-2">
              <Label htmlFor="leverage">Apalancamiento</Label>
              <Select value={leverage} onValueChange={setLeverage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:50">1:50</SelectItem>
                  <SelectItem value="1:100">1:100</SelectItem>
                  <SelectItem value="1:200">1:200</SelectItem>
                  <SelectItem value="1:500">1:500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Client ID */}
            <div className="space-y-2">
              <Label htmlFor="clientId">ID Cliente</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="CLI-001"
                required
              />
            </div>

            <Separator />

            {/* Risk Management */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stopLoss">Stop Loss</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  step="0.0001"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="1.0800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="takeProfit">Take Profit</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  step="0.0001"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  placeholder="1.0900"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comentarios adicionales sobre la operación..."
                rows={3}
              />
            </div>

            {/* Calculation Summary */}
            {amount && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calculator className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Resumen de la Operación</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Nocional:</span>
                    <span className="font-mono">${calculatedValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margen Requerido:</span>
                    <span className="font-mono">
                      ${(calculatedValue / Number.parseInt(leverage.split(":")[1])).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${tradeType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                Confirmar {tradeType === "buy" ? "Compra" : "Venta"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
