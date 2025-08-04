"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ClientSelector } from "@/components/shared/client-selector"
import { FileText, Calculator } from "lucide-react"

interface QuoteOperation {
  id: string
  pair: string
  type: "buy" | "sell"
  amount: number
  quotedPrice: number
  timestamp: string
  status: string
}

interface SpotTicketModalProps {
  isOpen: boolean
  onClose: () => void
  operation: QuoteOperation | null
  onComplete: (data: any) => void
  userRole: string
}

export function SpotTicketModal({ isOpen, onClose, operation, onComplete, userRole }: SpotTicketModalProps) {
  const [formData, setFormData] = useState({
    tradingBook: "MMSSPTX",
    salesBook: "SLSPTX",
    costPrice: "",
    clientPrice: "",
    equivalentAmount: "",
    profit: "",
    operationDate: new Date().toISOString().split("T")[0],
    client: null,
    observations: "",
  })

  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false)

  useEffect(() => {
    if (operation) {
      setFormData((prev) => ({
        ...prev,
        costPrice: operation.quotedPrice.toString(),
        clientPrice: operation.quotedPrice.toString(),
      }))
    }
  }, [operation])

  // Auto-calculate equivalent amount and profit
  useEffect(() => {
    if (operation && formData.clientPrice) {
      const clientPrice = Number.parseFloat(formData.clientPrice)
      const costPrice = Number.parseFloat(formData.costPrice)
      const amount = operation.amount

      if (clientPrice && costPrice && amount) {
        const equivalent = amount * clientPrice
        const profit = (clientPrice - costPrice) * amount

        setFormData((prev) => ({
          ...prev,
          equivalentAmount: equivalent.toFixed(2),
          profit: profit.toFixed(2),
        }))
      }
    }
  }, [formData.clientPrice, formData.costPrice, operation])

  if (!operation) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.client) {
      alert("Debe seleccionar un cliente")
      return
    }

    const ticketData = {
      operationId: operation.id,
      type: operation.type,
      pair: operation.pair,
      quotedAmount: operation.amount,
      costPrice: Number.parseFloat(formData.costPrice),
      clientPrice: Number.parseFloat(formData.clientPrice),
      equivalentAmount: Number.parseFloat(formData.equivalentAmount),
      profit: Number.parseFloat(formData.profit),
      tradingBook: formData.tradingBook,
      salesBook: formData.salesBook,
      operationDate: formData.operationDate,
      client: formData.client,
      observations: formData.observations,
      timestamp: new Date().toISOString(),
    }

    onComplete(ticketData)
    alert("Operación registrada exitosamente")
  }

  const handleCancel = () => {
    if (confirm("¿Está seguro que desea anular esta operación?")) {
      onClose()
      alert("Operación anulada")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Ticket Spot - {operation.pair}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                <Badge variant={operation.type === "buy" ? "default" : "destructive"} className="ml-2">
                  {operation.type === "buy" ? "COMPRA" : "VENTA"}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Par:</span>
                <p className="font-medium">{operation.pair}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Monto Cotizado:</span>
                <p className="font-mono font-medium">${operation.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label>Cliente *</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.client ? `${formData.client.name} (${formData.client.rut})` : ""}
                  placeholder="Seleccionar cliente..."
                  readOnly
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={() => setIsClientSelectorOpen(true)}>
                  Buscar
                </Button>
              </div>
            </div>

            {/* Books */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Libro Trading</Label>
                <Select
                  value={formData.tradingBook}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tradingBook: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMSSPTX">MMSSPTX</SelectItem>
                    <SelectItem value="MMSSPTARB">MMSSPTARB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Libro Sales</Label>
                <Select
                  value={formData.salesBook}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, salesBook: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SLSPTX">SLSPTX</SelectItem>
                    <SelectItem value="SLSPTARB">SLSPTARB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio Costo</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.costPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Cliente</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.clientPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, clientPrice: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label>Fecha de Operación</Label>
              <Input
                type="date"
                value={formData.operationDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, operationDate: e.target.value }))}
                required
              />
            </div>

            <Separator />

            {/* Auto Calculations */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Cálculos Automáticos</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Monto Equivalente:</span>
                  <p className="font-mono font-medium">${formData.equivalentAmount}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Utilidad:</span>
                  <p className="font-mono font-medium text-green-600">${formData.profit}</p>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                value={formData.observations}
                onChange={(e) => setFormData((prev) => ({ ...prev, observations: e.target.value }))}
                placeholder="Comentarios adicionales sobre la operación..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button type="button" variant="destructive" onClick={handleCancel} className="flex-1">
                Anular
              </Button>
              <Button type="submit" className="flex-1">
                Registrar
              </Button>
            </div>
          </form>
        </div>

        {/* Client Selector Modal */}
        <ClientSelector
          isOpen={isClientSelectorOpen}
          onClose={() => setIsClientSelectorOpen(false)}
          onSelect={(client) => {
            setFormData((prev) => ({ ...prev, client }))
            setIsClientSelectorOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
