"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"

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

interface UsdPositionProps {
  operations: CompletedOperation[]
}

interface PositionSummary {
  pair: string
  origen: string
  buyAmount: number
  sellAmount: number
  netPosition: number
  profit: number
  operationsCount: number
}

export function UsdPosition({ operations }: UsdPositionProps) {
  // Calcular posiciones por divisa y origen
  const positionMap = new Map<string, PositionSummary>()

  operations
    .filter((op) => op.status === "completed")
    .forEach((operation) => {
      const key = `${operation.pair}-${operation.client.codigoOrigen}`

      if (!positionMap.has(key)) {
        positionMap.set(key, {
          pair: operation.pair,
          origen: operation.client.codigoOrigen,
          buyAmount: 0,
          sellAmount: 0,
          netPosition: 0,
          profit: 0,
          operationsCount: 0,
        })
      }

      const position = positionMap.get(key)!

      if (operation.type === "buy") {
        position.buyAmount += operation.amount
      } else {
        position.sellAmount += operation.amount
      }

      position.profit += operation.profit
      position.operationsCount += 1
      position.netPosition = position.buyAmount - position.sellAmount
    })

  const positions = Array.from(positionMap.values())

  // Calcular totales
  const totalBuy = positions.reduce((sum, pos) => sum + pos.buyAmount, 0)
  const totalSell = positions.reduce((sum, pos) => sum + pos.sellAmount, 0)
  const totalNet = totalBuy - totalSell
  const totalProfit = positions.reduce((sum, pos) => sum + pos.profit, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Compras</p>
                <p className="text-2xl font-bold text-blue-600">${totalBuy.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-red-600">${totalSell.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Posición Neta</p>
                <p className={`text-2xl font-bold ${totalNet >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${totalNet.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilidad Total</p>
                <p className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Position Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Posición USD por Divisa y Origen</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No hay operaciones completadas para mostrar posiciones</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Par de Divisas</TableHead>
                  <TableHead>Código Origen</TableHead>
                  <TableHead>Compras USD</TableHead>
                  <TableHead>Ventas USD</TableHead>
                  <TableHead>Posición Neta</TableHead>
                  <TableHead>Utilidad</TableHead>
                  <TableHead>Operaciones</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{position.pair}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{position.origen}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-blue-600">${position.buyAmount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-red-600">${position.sellAmount.toLocaleString()}</TableCell>
                    <TableCell
                      className={`font-mono font-bold ${position.netPosition >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      ${position.netPosition.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-green-600">${position.profit.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{position.operationsCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={Math.abs(position.netPosition) > 100000 ? "destructive" : "default"}>
                        {Math.abs(position.netPosition) > 100000 ? "ALTO RIESGO" : "NORMAL"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
