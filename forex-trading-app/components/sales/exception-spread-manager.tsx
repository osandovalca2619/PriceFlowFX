"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ClientSelector } from "@/components/shared/client-selector"
import { Settings, Plus, Edit, Save, X, Trash2, Search } from "lucide-react"

interface ExceptionSpreadConfig {
  id: string
  client: {
    rut: string
    name: string
    segmento: string
  }
  pair: string
  buySpread: number
  sellSpread: number
  validFrom: string
  validTo: string
  active: boolean
}

export function ExceptionSpreadManager({ user }) {
  const [spreadConfigs, setSpreadConfigs] = useState<ExceptionSpreadConfig[]>([
    {
      id: "1",
      client: {
        rut: "12.345.678-9",
        name: "Juan Pérez González",
        segmento: "Premium",
      },
      pair: "EUR/USD",
      buySpread: 0.0001,
      sellSpread: 0.0001,
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      active: true,
    },
    {
      id: "2",
      client: {
        rut: "98.765.432-1",
        name: "María García López",
        segmento: "Corporate",
      },
      pair: "GBP/USD",
      buySpread: 0.0002,
      sellSpread: 0.0002,
      validFrom: "2024-01-01",
      validTo: "2024-06-30",
      active: true,
    },
  ])

  const [newSpread, setNewSpread] = useState<Partial<ExceptionSpreadConfig>>({
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: true,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<ExceptionSpreadConfig>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false)

  // Filters
  const [filterRut, setFilterRut] = useState("")
  const [filterName, setFilterName] = useState("")
  const [filterSegment, setFilterSegment] = useState("all")

  const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF"]
  const segments = ["Premium", "Corporate", "Retail", "Private"]

  const filteredConfigs = spreadConfigs.filter((config) => {
    return (
      (filterRut === "" || config.client.rut.includes(filterRut)) &&
      (filterName === "" || config.client.name.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterSegment === "all" || config.client.segmento === filterSegment)
    )
  })

  const handleClientSelect = (client: any) => {
    setNewSpread((prev) => ({ ...prev, client }))
    setIsClientSelectorOpen(false)
  }

  const handleAddNew = () => {
    if (newSpread.client && newSpread.pair) {
      const newConfig: ExceptionSpreadConfig = {
        id: Date.now().toString(),
        client: newSpread.client,
        pair: newSpread.pair,
        buySpread: newSpread.buySpread || 0,
        sellSpread: newSpread.sellSpread || 0,
        validFrom: newSpread.validFrom || new Date().toISOString().split("T")[0],
        validTo: newSpread.validTo || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        active: newSpread.active ?? true,
      }
      setSpreadConfigs((prev) => [...prev, newConfig])
      setNewSpread({
        validFrom: new Date().toISOString().split("T")[0],
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        active: true,
      })
      setIsAddingNew(false)
    }
  }

  const handleEdit = (config: ExceptionSpreadConfig) => {
    setEditingId(config.id)
    setEditData({ ...config })
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setSpreadConfigs((prev) =>
        prev.map((config) =>
          config.id === editingId ? ({ ...config, ...editData } as ExceptionSpreadConfig) : config,
        ),
      )
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este spread de excepción?")) {
      setSpreadConfigs((prev) => prev.filter((config) => config.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setIsAddingNew(false)
    setNewSpread({
      validFrom: new Date().toISOString().split("T")[0],
      validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      active: true,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Mantenedor de Spreads de Excepción</span>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Excepción
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium mb-4">Agregar Spread de Excepción</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Cliente</label>
                    <div className="flex space-x-2">
                      <Input
                        value={newSpread.client ? `${newSpread.client.name} (${newSpread.client.rut})` : ""}
                        placeholder="Seleccionar cliente..."
                        readOnly
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={() => setIsClientSelectorOpen(true)}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Spread Compra</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newSpread.buySpread || ""}
                      onChange={(e) => setNewSpread((prev) => ({ ...prev, buySpread: Number(e.target.value) }))}
                      placeholder="0.0001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Spread Venta</label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={newSpread.sellSpread || ""}
                      onChange={(e) => setNewSpread((prev) => ({ ...prev, sellSpread: Number(e.target.value) }))}
                      placeholder="0.0001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Válido Desde</label>
                    <Input
                      type="date"
                      value={newSpread.validFrom || ""}
                      onChange={(e) => setNewSpread((prev) => ({ ...prev, validFrom: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Válido Hasta</label>
                    <Input
                      type="date"
                      value={newSpread.validTo || ""}
                      onChange={(e) => setNewSpread((prev) => ({ ...prev, validTo: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
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
              <label className="text-sm font-medium">Filtrar por RUT</label>
              <Input value={filterRut} onChange={(e) => setFilterRut(e.target.value)} placeholder="12.345.678-9" />
            </div>
            <div>
              <label className="text-sm font-medium">Filtrar por Nombre</label>
              <Input
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Nombre del cliente"
              />
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

          {/* Exception Spreads Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>RUT</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Spread Compra</TableHead>
                  <TableHead>Spread Venta</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.client.name}</TableCell>
                    <TableCell className="font-mono">{config.client.rut}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.client.segmento}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{config.pair}</TableCell>
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
                    <TableCell className="text-sm">
                      {new Date(config.validFrom).toLocaleDateString()} -{" "}
                      {new Date(config.validTo).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.active ? "default" : "secondary"}>
                        {config.active ? "ACTIVO" : "INACTIVO"}
                      </Badge>
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
            <div className="text-center py-8 text-gray-500">
              No se encontraron spreads de excepción con los filtros aplicados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client Selector Modal */}
      <ClientSelector
        isOpen={isClientSelectorOpen}
        onClose={() => setIsClientSelectorOpen(false)}
        onSelect={handleClientSelect}
      />
    </div>
  )
}
