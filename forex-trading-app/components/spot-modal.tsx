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
import { ClientSelector } from "@/components/client-selector"
import { FileText, Calculator } from "lucide-react"

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

interface SpotModalProps {
  isOpen: boolean
  onClose: () => void
  operation: PendingOperation | CompletedOperation | null
  onComplete: (data: any) => void
  userRole: string
}

export function SpotModal({ isOpen, onClose, operation, onComplete, userRole }: SpotModalProps) {
  const [formData, setFormData] = useState({
    tradingBook: "MMSSPTX",
    salesBook: "SLSPTX",
    amount: "",
    costPrice: "",
    clientPrice: "",
    margin: "",
    profit: "",
    equivalentAmount: "",
    operationDate: new Date().toISOString().split("T")[0],
    client: null,
    comments: "",
  })

  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false)
  const [isReadOnly, setIsReadOnly] = useState(false)

  useEffect(() => {
    if (operation && "status" in operation && operation.status === "completed") {
      // Cargar datos de operación completada
      const completedOp = operation as CompletedOperation
      setFormData({
        tradingBook: completedOp.tradingBook,
        salesBook: completedOp.salesBook,
        amount: completedOp.amount.toString(),
        costPrice: completedOp.costPrice.toString(),
        clientPrice: completedOp.clientPrice.toString(),
        margin: completedOp.margin.toString(),
        profit: completedOp.profit.toString(),
        equivalentAmount: completedOp.equivalentAmount.toString(),
        operationDate: completedOp.operationDate,
        client: completedOp.client,
        comments: completedOp.comments,
      })
      setIsReadOnly(userRole === "consultas")
    } else if (operation) {
      // Operación pendiente - inicializar con precio base
      setFormData((prev) => ({
        ...prev,
        costPrice: operation.price.toString(),
        clientPrice: operation.price.toString(),
      }))
      setIsReadOnly(false)
    }
  }, [operation, userRole])

  // Cálculos automáticos
  useEffect(() => {
    const amount = Number.parseFloat(formData.amount) || 0
    const costPrice = Number.parseFloat(formData.costPrice) || 0
    const clientPrice = Number.parseFloat(formData.clientPrice) || 0

    if (amount && costPrice && clientPrice) {
      const margin = clientPrice - costPrice
      const profit = margin * amount
      const equivalentAmount = amount * clientPrice

      setFormData((prev) => ({
        ...prev,
        margin: margin.toFixed(4),
        profit: profit.toFixed(2),
        equivalentAmount: equivalentAmount.toFixed(2),
      }))
    }
  }, [formData.amount, formData.costPrice, formData.clientPrice])

  if (!operation) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.client) {
      alert("Debe seleccionar un cliente")
      return
    }

    const operationData = {
      tradingBook: formData.tradingBook,
      salesBook: formData.salesBook,
      amount: Number.parseFloat(formData.amount),
      costPrice: Number.parseFloat(formData.costPrice),
      clientPrice: Number.parseFloat(formData.clientPrice),
      margin: Number.parseFloat(formData.margin),
      profit: Number.parseFloat(formData.profit),
      equivalentAmount: Number.parseFloat(formData.equivalentAmount),
      operationDate: formData.operationDate,
      client: formData.client,
      comments: formData.comments,
    }

    onComplete(operationData)
  }

  const handleCancel = () => {
    if ("status" in operation && operation.status === "completed") {
      // Lógica para anular operación completada
      console.log("Anulando operación:", operation.id)
    }
    onClose()
  }

  const isCompleted = "status" in operation && operation.status === "completed"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>
              {isCompleted ? "Detalle de Operación" : "Completar Operación"} - {operation.pair}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Par:</span>
                <p className="font-medium">{operation.pair}</p>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <Badge variant={operation.type === "buy" ? "default" : "destructive"}>
                  {operation.type === "buy" ? "COMPRA" : "VENTA"}
                </Badge>
              </div>
              <div>
                <span className="text-gray-600">Precio Base:</span>
                <p className="font-mono font-medium">{operation.price.toFixed(4)}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Libros */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Libro Trading</Label>
                <Select
                  value={formData.tradingBook}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tradingBook: value }))}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMSSPTX">MMSSPTX</SelectItem>
                    <SelectItem value="MMSSPTY">MMSSPTY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Libro Venta</Label>
                <Select
                  value={formData.salesBook}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, salesBook: value }))}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SLSPTX">SLSPTX</SelectItem>
                    <SelectItem value="SLSPTY">SLSPTY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Montos y Precios */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monto</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="100000"
                  disabled={isReadOnly}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha Operación</Label>
                <Input
                  type="date"
                  value={formData.operationDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, operationDate: e.target.value }))}
                  disabled={isReadOnly}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Precio Costo</Label>
                <Input
                  type="number"
                  step="0.0001"
                  value={formData.costPrice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, costPrice: e.target.value }))}
                  disabled={isReadOnly}
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
                  disabled={isReadOnly}
                  required
                />
              </div>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <div className="flex space-x-2">
                <Input
                  value={formData.client ? `${formData.client.name} (${formData.client.rut})` : ""}
                  placeholder="Seleccionar cliente..."
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsClientSelectorOpen(true)}
                  disabled={isReadOnly}
                >
                  Buscar
                </Button>
              </div>
            </div>

            <Separator />

            {/* Cálculos Automáticos */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Cálculos Automáticos</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Margen:</span>
                  <p className="font-mono font-medium">{formData.margin}</p>
                </div>
                <div>
                  <span className="text-gray-600">Utilidad:</span>
                  <p className="font-mono font-medium">${formData.profit}</p>
                </div>
                <div>
                  <span className="text-gray-600">Monto Equivalente:</span>
                  <p className="font-mono font-medium">${formData.equivalentAmount}</p>
                </div>
              </div>
            </div>

            {/* Comentarios */}
            <div className="space-y-2">
              <Label>Comentarios</Label>
              <Textarea
                value={formData.comments}
                onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                placeholder="Comentarios adicionales sobre la operación..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                {isCompleted ? "Cerrar" : "Cancelar"}
              </Button>
              {!isReadOnly && (
                <>
                  {isCompleted && (
                    <Button type="button" variant="destructive" onClick={handleCancel} className="flex-1">
                      Anular
                    </Button>
                  )}
                  <Button type="submit" className="flex-1">
                    {isCompleted ? "Modificar" : "Registrar"}
                  </Button>
                </>
              )}
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
