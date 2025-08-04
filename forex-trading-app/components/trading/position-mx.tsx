"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { TrendingUp, TrendingDown, Lock, Unlock } from "lucide-react"

interface ChannelPosition {
  channel: string
  buyAmount: number
  buyAvgPrice: number
  sellAmount: number
  sellAvgPrice: number
  netPosition: number
  blocked: boolean
}

interface Operation {
  id: string
  timestamp: string
  pair: string
  type: "buy" | "sell"
  amount: number
  price: number
  channel: string
  status: string
}

interface ModificationEvent {
  id: string
  operationId: string
  type: "modify" | "cancel"
  requestedBy: string
  timestamp: string
  status: "pending" | "approved" | "rejected"
  details: string
}

export function PositionMX({ user }) {
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [volatilityScenario, setVolatilityScenario] = useState("normal")
  const [calculationAmount, setCalculationAmount] = useState("")

  const [channelPositions, setChannelPositions] = useState<ChannelPosition[]>([
    {
      channel: "Bloomberg",
      buyAmount: 2500000,
      buyAvgPrice: 1.0845,
      sellAmount: 1800000,
      sellAvgPrice: 1.0847,
      netPosition: 700000,
      blocked: false,
    },
    {
      channel: "Reuters",
      buyAmount: 1200000,
      buyAvgPrice: 1.0844,
      sellAmount: 1500000,
      sellAvgPrice: 1.0848,
      netPosition: -300000,
      blocked: false,
    },
    {
      channel: "Datatec",
      buyAmount: 800000,
      buyAvgPrice: 1.0846,
      sellAmount: 600000,
      sellAvgPrice: 1.0849,
      netPosition: 200000,
      blocked: false,
    },
    {
      channel: "Web Empresa",
      buyAmount: 3200000,
      buyAvgPrice: 1.085,
      sellAmount: 2800000,
      sellAvgPrice: 1.0852,
      netPosition: 400000,
      blocked: false,
    },
    {
      channel: "Sales",
      buyAmount: 1800000,
      buyAvgPrice: 1.0848,
      sellAmount: 2200000,
      sellAvgPrice: 1.0851,
      netPosition: -400000,
      blocked: false,
    },
    {
      channel: "Wealth",
      buyAmount: 900000,
      buyAvgPrice: 1.0847,
      sellAmount: 700000,
      sellAvgPrice: 1.085,
      netPosition: 200000,
      blocked: false,
    },
    {
      channel: "Corredora",
      buyAmount: 1500000,
      buyAvgPrice: 1.0849,
      sellAmount: 1300000,
      sellAvgPrice: 1.0853,
      netPosition: 200000,
      blocked: false,
    },
    {
      channel: "Web Personas",
      buyAmount: 2800000,
      buyAvgPrice: 1.0851,
      sellAmount: 3200000,
      sellAvgPrice: 1.0854,
      netPosition: -400000,
      blocked: false,
    },
    {
      channel: "App Móvil",
      buyAmount: 1600000,
      buyAvgPrice: 1.0852,
      sellAmount: 1400000,
      sellAvgPrice: 1.0855,
      netPosition: 200000,
      blocked: false,
    },
    {
      channel: "Sucursales",
      buyAmount: 4200000,
      buyAvgPrice: 1.0853,
      sellAmount: 3800000,
      sellAvgPrice: 1.0856,
      netPosition: 400000,
      blocked: false,
    },
  ])

  const [recentOperations] = useState<Operation[]>([
    {
      id: "OP001",
      timestamp: "2024-01-15 14:30:25",
      pair: "EUR/USD",
      type: "buy",
      amount: 100000,
      price: 1.0845,
      channel: "Bloomberg",
      status: "completed",
    },
    {
      id: "OP002",
      timestamp: "2024-01-15 14:28:15",
      pair: "EUR/USD",
      type: "sell",
      amount: 150000,
      price: 1.0847,
      channel: "Web Empresa",
      status: "completed",
    },
    {
      id: "OP003",
      timestamp: "2024-01-15 14:25:10",
      pair: "EUR/USD",
      type: "buy",
      amount: 200000,
      price: 1.0844,
      channel: "Reuters",
      status: "completed",
    },
  ])

  const [modificationEvents] = useState<ModificationEvent[]>([
    {
      id: "EV001",
      operationId: "OP001",
      type: "modify",
      requestedBy: "sales@forex.com",
      timestamp: "2024-01-15 14:35:00",
      status: "pending",
      details: "Cambio de monto de 100,000 a 120,000",
    },
    {
      id: "EV002",
      operationId: "OP002",
      type: "cancel",
      requestedBy: "middle@forex.com",
      timestamp: "2024-01-15 14:32:00",
      status: "pending",
      details: "Anulación por error en cliente",
    },
  ])

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF"]
  const currentPrice = { bid: 1.0845, ask: 1.0847 }

  const toggleChannelBlock = (channelIndex: number) => {
    setChannelPositions((prev) =>
      prev.map((pos, index) => (index === channelIndex ? { ...pos, blocked: !pos.blocked } : pos)),
    )
  }

  const handleEventAction = (eventId: string, action: "approve" | "reject") => {
    console.log(`${action} event ${eventId}`)
    // Implement event approval/rejection logic
  }

  const totalBuy = channelPositions.reduce((sum, pos) => sum + pos.buyAmount, 0)
  const totalSell = channelPositions.reduce((sum, pos) => sum + pos.sellAmount, 0)
  const totalNet = totalBuy - totalSell

  const calculatedPrice = calculationAmount
    ? (Number.parseFloat(calculationAmount) * currentPrice.ask).toFixed(2)
    : "0.00"

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controles de Posición</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Divisa</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Escenario de Volatilidad</label>
              <Select value={volatilityScenario} onValueChange={setVolatilityScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="volatile">Volátil</SelectItem>
                  <SelectItem value="high-volatile">Alta Volatilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Card and Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>EUR/{selectedCurrency}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Compra</p>
                <p className="text-2xl font-bold text-blue-600">{currentPrice.ask.toFixed(4)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Venta</p>
                <p className="text-2xl font-bold text-red-600">{currentPrice.bid.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Precio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Monto</label>
                <Input
                  type="number"
                  value={calculationAmount}
                  onChange={(e) => setCalculationAmount(e.target.value)}
                  placeholder="100000"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">Precio Distribuido</p>
                <p className="text-xl font-bold">${calculatedPrice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Position Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ventas</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posición Neta</p>
                <p className={`text-2xl font-bold ${totalNet >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${totalNet.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Posición por Canal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Precio Prom. Compra</TableHead>
                <TableHead>Ventas</TableHead>
                <TableHead>Precio Prom. Venta</TableHead>
                <TableHead>Posición Neta</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPositions.map((position, index) => (
                <TableRow key={position.channel}>
                  <TableCell className="font-medium">{position.channel}</TableCell>
                  <TableCell className="text-blue-600 font-mono">${position.buyAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{position.buyAvgPrice.toFixed(4)}</TableCell>
                  <TableCell className="text-red-600 font-mono">${position.sellAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-mono">{position.sellAvgPrice.toFixed(4)}</TableCell>
                  <TableCell
                    className={`font-mono font-bold ${position.netPosition >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${position.netPosition.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch checked={!position.blocked} onCheckedChange={() => toggleChannelBlock(index)} />
                      {position.blocked ? (
                        <Lock className="h-4 w-4 text-red-500" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Últimas Operaciones</TabsTrigger>
          <TabsTrigger value="events">Eventos de Modificación</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Últimas Operaciones - EUR/{selectedCurrency}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOperations.map((operation) => (
                    <TableRow key={operation.id}>
                      <TableCell className="font-mono">{operation.id}</TableCell>
                      <TableCell className="text-sm">{operation.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={operation.type === "buy" ? "default" : "destructive"}>
                          {operation.type === "buy" ? "COMPRA" : "VENTA"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">${operation.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{operation.price.toFixed(4)}</TableCell>
                      <TableCell>{operation.channel}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{operation.status.toUpperCase()}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Modificación Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Evento</TableHead>
                    <TableHead>ID Operación</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Solicitado por</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modificationEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-mono">{event.id}</TableCell>
                      <TableCell className="font-mono">{event.operationId}</TableCell>
                      <TableCell>
                        <Badge variant={event.type === "modify" ? "default" : "destructive"}>
                          {event.type === "modify" ? "MODIFICAR" : "ANULAR"}
                        </Badge>
                      </TableCell>
                      <TableCell>{event.requestedBy}</TableCell>
                      <TableCell className="text-sm">{event.timestamp}</TableCell>
                      <TableCell className="text-sm">{event.details}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleEventAction(event.id, "approve")}>
                            Aprobar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEventAction(event.id, "reject")}>
                            Rechazar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
