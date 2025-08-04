"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { Search, FileText } from "lucide-react"

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

interface AllOperationsProps {
  operations: CompletedOperation[]
  onOperationClick: (operation: CompletedOperation) => void
}

export function AllOperations({ operations, onOperationClick }: AllOperationsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPair, setFilterPair] = useState("all")

  const filteredOperations = operations.filter((operation) => {
    const matchesSearch =
      operation.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      operation.client.rut.includes(searchTerm) ||
      operation.id.includes(searchTerm)

    const matchesStatus = filterStatus === "all" || operation.status === filterStatus
    const matchesPair = filterPair === "all" || operation.pair === filterPair

    return matchesSearch && matchesStatus && matchesPair
  })

  const uniquePairs = [...new Set(operations.map((op) => op.pair))]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Todas las Operaciones ({operations.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por par, cliente, RUT o ID..."
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
        {filteredOperations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {operations.length === 0
              ? "No hay operaciones registradas"
              : "No se encontraron operaciones que coincidan con los filtros"}
          </div>
        ) : (
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
                  <TableHead>Precio Cliente</TableHead>
                  <TableHead>Utilidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperations.map((operation) => (
                  <TableRow key={operation.id}>
                    <TableCell className="font-mono text-sm">{operation.id.slice(-6)}</TableCell>
                    <TableCell className="text-sm">{new Date(operation.operationDate).toLocaleDateString()}</TableCell>
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
                    <TableCell className="font-mono">{operation.clientPrice.toFixed(4)}</TableCell>
                    <TableCell className="font-mono text-green-600">${operation.profit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={operation.status === "completed" ? "default" : "secondary"}>
                        {operation.status === "completed" ? "COMPLETADA" : "ANULADA"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => onOperationClick(operation)}>
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
