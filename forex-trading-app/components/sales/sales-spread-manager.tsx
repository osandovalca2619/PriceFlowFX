"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Edit, Save, X, Trash2 } from "lucide-react"

interface SalesSpreadConfig {
  id: string
  pair: string
  channel: string
  segment: string
  buySpread: number
  sellSpread: number
}

export function SalesSpreadManager({ user }) {
  const [spreadConfigs, setSpreadConfigs] = useState<SalesSpreadConfig[]>([
    {
      id: "1",
      pair: "EUR/USD",
      channel: "Web Empresa",
      segment: "Premium",
      buySpread: 0.0003,
      sellSpread: 0.0003,
    },
    {
      id: "2",
      pair: "EUR/USD",
      channel: "Sales",
      segment: "Corporate",
      buySpread: 0.0002,
      sellSpread: 0.0002,
    },
    {
      id: "3",
      pair: "GBP/USD",
      channel: "Web Personas",
      segment: "Retail",
      buySpread: 0.0005,
      sellSpread: 0.0005,
    },
  ])

  const [newSpread, setNewSpread] = useState<Partial<SalesSpreadConfig>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<SalesSpreadConfig>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Filters
  const [filterPair, setFilterPair] = useState("all")
  const [filterChannel, setFilterChannel] = useState("all")
  const [filterSegment, setFilterSegment] = useState("all")

  const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF"]
  const channels = ["Bloomberg", "Reuters", "Web Empresa", "Sales", "Web Personas", "App Móvil", "Sucursales"]
  const segments = ["Premium", "Corporate", "Retail", "Private"]

  const filteredConfigs = spreadConfigs.filter((config) => {
    return (
      (filterPair === "all" || config.pair === filterPair) &&
      (filterChannel === "all" || config.channel === filterChannel) &&
      (filterSegment === "all" || config.segment === filterSegment)
    )
  })

  const handleAddNew = () => {
    if (newSpread.pair && newSpread.channel && newSpread.segment) {
      const newConfig: SalesSpreadConfig = {
        id: Date.now().toString(),
        pair: newSpread.pair,
        channel: newSpread.channel,
        segment: newSpread.segment,
        buySpread: newSpread.buySpread || 0,
        sellSpread: newSpread.sellSpread || 0,
      }
      setSpreadConfigs((prev) => [...prev, newConfig])
      setNewSpread({})
      setIsAddingNew(false)
    }
  }

  const handleEdit = (config: SalesSpreadConfig) => {
    setEditingId(config.id)
    setEditData({ ...config })
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setSpreadConfigs((prev) =>
        prev.map((config) => (config.id === editingId ? ({ ...config, ...editData } as SalesSpreadConfig) : config)),
      )
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este spread?")) {
      setSpreadConfigs((prev) => prev.filter((config) => config.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setIsAddingNew(false)
    setNewSpread({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Mantenedor de Spreads Ventas</span>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Spread
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium mb-4">Agregar Nuevo Spread</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Par de Divisa</label>
                  <Select
                    value={newSpread.pair || ""}
                    onValueChange={(value) => setNewSpread((prev) => ({ ...prev, pair: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar par" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyPairs.map((pair) => (
                        <SelectItem key={pair} value={pair}>
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Canal</label>
                  <Select
                    value={newSpread.channel || ""}
                    onValueChange={(value) => setNewSpread((prev) => ({ ...prev, channel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar canal" />
                    </SelectTrigger>
                    <SelectContent>
                      {channels.map((channel) => (
                        <SelectItem key={channel} value={channel}>
                          {channel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Segmento</label>
                  <Select
                    value={newSpread.segment || ""}
                    onValueChange={(value) => setNewSpread((prev) => ({ ...prev, segment: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar segmento" />
                    </SelectTrigger>
                    <SelectContent>
                      {segments.map((segment) => (
                        <SelectItem key={segment} value={segment}>
                          {segment}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Spread Compra</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newSpread.buySpread || ""}
                    onChange={(e) => setNewSpread((prev) => ({ ...prev, buySpread: Number(e.target.value) }))}
                    placeholder="0.0003"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Spread Venta</label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={newSpread.sellSpread || ""}
                    onChange={(e) => setNewSpread((prev) => ({ ...prev, sellSpread: Number(e.target.value) }))}
                    placeholder="0.0003"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <Button onClick={handleAddNew}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Filtrar por Par</label>
              <Select value={filterPair} onValueChange={setFilterPair}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {currencyPairs.map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Filtrar por Canal</label>
              <Select value={filterChannel} onValueChange={setFilterChannel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Filtrar por Segmento</label>
              <Select value={filterSegment} onValueChange={setFilterSegment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {segments.map((segment) => (
                    <SelectItem key={segment} value={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Spreads Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Par</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Spread Compra</TableHead>
                  <TableHead>Spread Venta</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.pair}</TableCell>
                    <TableCell>{config.channel}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.segment}</Badge>
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <Input
                          type="number"
                          step="0.0001"
                          value={editData.buySpread ?? config.buySpread}
                          onChange={(e) => setEditData((prev) => ({ ...prev, buySpread: Number(e.target.value) }))}
                          className="w-24"
                        />
                      ) : (
                        <span className="font-mono">{config.buySpread.toFixed(4)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <Input
                          type="number"
                          step="0.0001"
                          value={editData.sellSpread ?? config.sellSpread}
                          onChange={(e) => setEditData((prev) => ({ ...prev, sellSpread: Number(e.target.value) }))}
                          className="w-24"
                        />
                      ) : (
                        <span className="font-mono">{config.sellSpread.toFixed(4)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(config.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredConfigs.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron spreads con los filtros aplicados</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
