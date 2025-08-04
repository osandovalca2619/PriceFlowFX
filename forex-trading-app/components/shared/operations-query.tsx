"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, FileText, Edit, X } from "lucide-react"

interface Operation {
  id: string
  date: string
  pair: string
  type: "buy" | "sell"
  amount: number
  price: number
  client: {
    rut: string
    name: string
  }
  channel: string
  status: "completed" | "cancelled" | "pending"
  profit: number
}

export function OperationsQuery({ user }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPair, setFilterPair] = useState("all")
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const operations: Operation[] = [
    {
      id: "OP001",
      date: "2024-01-15",
      pair: "EUR/USD",
      type: "buy",
      amount: 100000,
      price: 1.0845,
      client: { rut: "12.345.678-9", name: "Juan Pérez González" },
      channel: "Bloomberg",
      status: "completed",
      profit: 125.5,
    },
    {
      id: "OP002",
      date: "2024-01-15",
      pair: "GBP/USD",
      type: "sell",
      amount: 150000,
      price: 1.2634,
      client: { rut: "98.765.432-1", name: "María García López" },
      channel: "Web Empresa",
      status: "completed",
      profit: 89.75,
    },
    {
      id: "OP003",
      date: "2024-01-15",
      pair: "USD/JPY",
      type: "buy",
      amount: 200000,
      price: 149.85,
      client: { rut: "11.222.333-4", name: "Carlos Rodríguez Silva" },
      channel: "Sales",
      status: "pending",
      profit: 0,
    },
  ]

  const filteredOperations = operations.filter((operation) => {
    const matchesSearch =
      operation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.client.rut.includes(searchTerm) ||
      operation.pair.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || operation.status === filterStatus
    const matchesPair = filterPair === "all" || operation.pair === filterPair

    return matchesSearch && matchesStatus && matchesPair
  })

  const uniquePairs = [...new Set(operations.map((op) => op.pair))]

  const handleOperationClick = (operation: Operation) => {
    setSelectedOperation(operation)
    setIsDetailModalOpen(true)
  }

  const handleModifyOperation = () => {
    if (selectedOperation) {
      console.log("Modify operation:", selectedOperation.id)
      alert("Evento de modificación generado")
    }
  }

  const handleCancelOperation = () => {
    if (selectedOperation && confirm("¿Está seguro que desea anular esta operación?")) {
      console.log("Cancel operation:", selectedOperation.id)
      alert("Evento de anulación generado")
      setIsDetailModalOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Consulta de Operaciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por ID, cliente, RUT o par..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="cancelled">Anuladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPair} onValueChange={setFilterPair}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {uniquePairs.map((pair) => (
                  <SelectItem key={pair} value={pair}>
                    {pair}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Operations Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Utilidad</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((operation) => (
                  <TableRow key={operation.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="font-mono">{operation.id}</TableCell>
                    <TableCell>{new Date(operation.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{operation.pair}</TableCell>
                    <TableCell>
                      <Badge variant={operation.type === "buy" ? "default" : "destructive"}>
                        {operation.type === "buy" ? "COMPRA" : "VENTA"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{operation.client.name}</p>
                        <p className="text-gray-500">{operation.client.rut}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">${operation.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono">{operation.price.toFixed(4)}</TableCell>
                    <TableCell>{operation.channel}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          operation.status === "completed"
                            ? "default"
                            : operation.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {operation.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-green-600">${operation.profit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleOperationClick(operation)}>
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOperations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron operaciones que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>

      {/* Operation Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Detalle de Operación - {selectedOperation?.id}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOperation && (
            <div className="space-y-6">
              {/* Operation Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">ID Operación:</span>
                    <p className="font-mono font-medium">{selectedOperation.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fecha:</span>
                    <p className="font-medium">{new Date(selectedOperation.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Par de Divisas:</span>
                    <p className="font-medium">{selectedOperation.pair}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                    <Badge variant={selectedOperation.type === "buy" ? "default" : "destructive"}>
                      {selectedOperation.type === "buy" ? "COMPRA" : "VENTA"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Client and Financial Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Información del Cliente</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                      <p className="font-medium">{selectedOperation.client.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">RUT:</span>
                      <p className="font-mono">{selectedOperation.client.rut}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Canal:</span>
                      <p className="font-medium">{selectedOperation.channel}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Información Financiera</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monto:</span>
                      <p className="font-mono font-medium">${selectedOperation.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Precio:</span>
                      <p className="font-mono font-medium">{selectedOperation.price.toFixed(4)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Utilidad:</span>
                      <p className="font-mono font-medium text-green-600">${selectedOperation.profit.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                      <Badge
                        variant={
                          selectedOperation.status === "completed"
                            ? "default"
                            : selectedOperation.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {selectedOperation.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="flex-1">
                  Cerrar
                </Button>
                {user.role !== "middle" && selectedOperation.status !== "cancelled" && (
                  <>
                    <Button onClick={handleModifyOperation} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Modificar
                    </Button>
                    <Button variant="destructive" onClick={handleCancelOperation} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Anular
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
