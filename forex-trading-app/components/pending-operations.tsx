"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface PendingOperation {
  id: string
  pair: string
  type: "buy" | "sell"
  price: number
  timestamp: string
  status: "pending"
}

interface PendingOperationsProps {
  operations: PendingOperation[]
  onOperationClick: (operation: PendingOperation) => void
}

export function PendingOperations({ operations, onOperationClick }: PendingOperationsProps) {
  if (operations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Operaciones Pendientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No hay operaciones pendientes</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Operaciones Pendientes ({operations.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Par</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell className="font-medium">{operation.pair}</TableCell>
                <TableCell>
                  <Badge variant={operation.type === "buy" ? "default" : "destructive"}>
                    {operation.type === "buy" ? "COMPRA" : "VENTA"}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">{operation.price.toFixed(4)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(operation.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">PENDIENTE</Badge>
                </TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => onOperationClick(operation)}>
                    Completar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
