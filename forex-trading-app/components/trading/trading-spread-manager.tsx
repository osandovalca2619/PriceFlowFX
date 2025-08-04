"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Plus, Edit, Save, X } from "lucide-react"

interface TradingSpreadConfig {
  id: string
  pair: string
  minAmount: number
  maxAmount: number
  volatilityScenario: "normal" | "volatile" | "high-volatile"
  buySpread: number
  sellSpread: number
}

export function TradingSpreadManager({ user }) {
  const [selectedPair, setSelectedPair] = useState("EUR/USD")
  const [spreadConfigs, setSpreadConfigs] = useState<TradingSpreadConfig[]>([
    {
      id: "1",
      pair: "EUR/USD",
      minAmount: 0,
      maxAmount: 500000,
      volatilityScenario: "normal",
      buySpread: 0.0002,
      sellSpread: 0.0002,
    },
    {
      id: "2",
      pair: "EUR/USD",
      minAmount: 500001,
      maxAmount: 1000000,
      volatilityScenario: "normal",
      buySpread: 0.0001,
      sellSpread: 0.0001,
    },
    {
      id: "3",
      pair: "EUR/USD",
      minAmount: 0,
      maxAmount: 500000,
      volatilityScenario: "volatile",
      buySpread: 0.0004,
      sellSpread: 0.0004,
    },
    {
      id: "4",
      pair: "EUR/USD",
      minAmount: 0,
      maxAmount: 500000,
      volatilityScenario: "high-volatile",
      buySpread: 0.0008,
      sellSpread: 0.0008,
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [newConfig, setNewConfig] = useState<Partial<TradingSpreadConfig>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF"]
  const volatilityScenarios = [
    { value: "normal", label: "Normal" },
    { value: "volatile", label: "Volátil" },
    { value: "high-volatile", label: "Alta Volatilidad" },
  ]

  const filteredConfigs = spreadConfigs.filter((config) => config.pair === selectedPair)

  const handleEdit = (config: TradingSpreadConfig) => {
    setEditingId(config.id)
    setNewConfig({ ...config })
  }

  const handleSave = () => {
    if (editingId && newConfig) {
      setSpreadConfigs((prev) =>
        prev.map((config) => (config.id === editingId ? ({ ...config, ...newConfig } as TradingSpreadConfig) : config)),
      )
      setEditingId(null)
      setNewConfig({})
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setNewConfig({})
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    if (newConfig.minAmount !== undefined && newConfig.maxAmount !== undefined && newConfig.volatilityScenario) {
      const newSpreadConfig: TradingSpreadConfig = {
        id: Date.now().toString(),
        pair: selectedPair,
        minAmount: newConfig.minAmount,
        maxAmount: newConfig.maxAmount,
        volatilityScenario: newConfig.volatilityScenario as "normal" | "volatile" | "high-volatile",
        buySpread: newConfig.buySpread || 0,
        sellSpread: newConfig.sellSpread || 0,
      }
      setSpreadConfigs((prev) => [...prev, newSpreadConfig])
      setIsAddingNew(false)
      setNewConfig({})
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Mantenedor de Spreads Trading</span>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tramo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Pair Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Filtrar por Par de Divisa</label>
            <Select value={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-48">
                <SelectValue />
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

          {/* Spreads Matrix */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Monto Mínimo</TableHead>
                  <TableHead>Monto Máximo</TableHead>
                  <TableHead>Escenario</TableHead>
                  <TableHead>Spread Compra</TableHead>
                  <TableHead>Spread Venta</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Add New Row */}
                {isAddingNew && (
                  <TableRow className="bg-blue-50 dark:bg-blue-900/20">
                    <TableCell>
                      <Input
                        type="number"
                        value={newConfig.minAmount || ""}
                        onChange={(e) => setNewConfig((prev) => ({ ...prev, minAmount: Number(e.target.value) }))}
                        placeholder="0"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={newConfig.maxAmount || ""}
                        onChange={(e) => setNewConfig((prev) => ({ ...prev, maxAmount: Number(e.target.value) }))}
                        placeholder="500000"
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newConfig.volatilityScenario || ""}
                        onValueChange={(value) => setNewConfig((prev) => ({ ...prev, volatilityScenario: value }))}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Escenario" />
                        </SelectTrigger>
                        <SelectContent>
                          {volatilityScenarios.map((scenario) => (
                            <SelectItem key={scenario.value} value={scenario.value}>
                              {scenario.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.0001"
                        value={newConfig.buySpread || ""}
                        onChange={(e) => setNewConfig((prev) => ({ ...prev, buySpread: Number(e.target.value) }))}
                        placeholder="0.0002"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.0001"
                        value={newConfig.sellSpread || ""}
                        onChange={(e) => setNewConfig((prev) => ({ ...prev, sellSpread: Number(e.target.value) }))}
                        placeholder="0.0002"
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleAddNew}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* Existing Configs */}
                {filteredConfigs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      {editingId === config.id ? (
                        <Input
                          type="number"
                          value={newConfig.minAmount || config.minAmount}
                          onChange={(e) => setNewConfig((prev) => ({ ...prev, minAmount: Number(e.target.value) }))}
                          className="w-32"
                        />
                      ) : (
                        <span className="font-mono">${config.minAmount.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <Input
                          type="number"
                          value={newConfig.maxAmount || config.maxAmount}
                          onChange={(e) => setNewConfig((prev) => ({ ...prev, maxAmount: Number(e.target.value) }))}
                          className="w-32"
                        />
                      ) : (
                        <span className="font-mono">${config.maxAmount.toLocaleString()}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <Select
                          value={newConfig.volatilityScenario || config.volatilityScenario}
                          onValueChange={(value) => setNewConfig((prev) => ({ ...prev, volatilityScenario: value }))}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {volatilityScenarios.map((scenario) => (
                              <SelectItem key={scenario.value} value={scenario.value}>
                                {scenario.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge
                          variant={
                            config.volatilityScenario === "normal"
                              ? "default"
                              : config.volatilityScenario === "volatile"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {volatilityScenarios.find((s) => s.value === config.volatilityScenario)?.label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <Input
                          type="number"
                          step="0.0001"
                          value={newConfig.buySpread ?? config.buySpread}
                          onChange={(e) => setNewConfig((prev) => ({ ...prev, buySpread: Number(e.target.value) }))}
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
                          value={newConfig.sellSpread ?? config.sellSpread}
                          onChange={(e) => setNewConfig((prev) => ({ ...prev, sellSpread: Number(e.target.value) }))}
                          className="w-24"
                        />
                      ) : (
                        <span className="font-mono">{config.sellSpread.toFixed(4)}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === config.id ? (
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredConfigs.length === 0 && !isAddingNew && (
            <div className="text-center py-8 text-gray-500">No hay configuraciones de spread para {selectedPair}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
