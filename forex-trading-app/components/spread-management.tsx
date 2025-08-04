"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Plus, Edit, Save, X } from "lucide-react"

interface SpreadConfig {
  id: string
  pair: string
  minAmount: number
  maxAmount: number
  normalSpread: number
  volatileSpread: number
  highVolatileSpread: number
}

export function SpreadManagement() {
  const [spreadConfigs, setSpreadConfigs] = useState<SpreadConfig[]>([
    {
      id: "1",
      pair: "EUR/USD",
      minAmount: 0,
      maxAmount: 500000,
      normalSpread: 0.0002,
      volatileSpread: 0.0004,
      highVolatileSpread: 0.0008,
    },
    {
      id: "2",
      pair: "EUR/USD",
      minAmount: 500001,
      maxAmount: 1000000,
      normalSpread: 0.0001,
      volatileSpread: 0.0003,
      highVolatileSpread: 0.0006,
    },
    {
      id: "3",
      pair: "GBP/USD",
      minAmount: 0,
      maxAmount: 500000,
      normalSpread: 0.0003,
      volatileSpread: 0.0005,
      highVolatileSpread: 0.001,
    },
    {
      id: "4",
      pair: "USD/JPY",
      minAmount: 0,
      maxAmount: 1000000,
      normalSpread: 0.03,
      volatileSpread: 0.05,
      highVolatileSpread: 0.08,
    },
  ])

  const [editingId, setEditingId] = useState<string | null>(null)
  const [newConfig, setNewConfig] = useState<Partial<SpreadConfig>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleEdit = (config: SpreadConfig) => {
    setEditingId(config.id)
    setNewConfig({ ...config })
  }

  const handleSave = () => {
    if (editingId && newConfig) {
      setSpreadConfigs((prev) =>
        prev.map((config) => (config.id === editingId ? ({ ...config, ...newConfig } as SpreadConfig) : config)),
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
    if (newConfig.pair && newConfig.minAmount !== undefined && newConfig.maxAmount !== undefined) {
      const newSpreadConfig: SpreadConfig = {
        id: Date.now().toString(),
        pair: newConfig.pair,
        minAmount: newConfig.minAmount,
        maxAmount: newConfig.maxAmount,
        normalSpread: newConfig.normalSpread || 0,
        volatileSpread: newConfig.volatileSpread || 0,
        highVolatileSpread: newConfig.highVolatileSpread || 0,
      }
      setSpreadConfigs((prev) => [...prev, newSpreadConfig])
      setIsAddingNew(false)
      setNewConfig({})
    }
  }

  const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Gestión de Spreads</span>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Tramo
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="matrix" className="space-y-4">
            <TabsList>
              <TabsTrigger value="matrix">Matriz de Spreads</TabsTrigger>
              <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
            </TabsList>

            <TabsContent value="matrix">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Par</TableHead>
                      <TableHead>Monto Mínimo</TableHead>
                      <TableHead>Monto Máximo</TableHead>
                      <TableHead>Normal</TableHead>
                      <TableHead>Volátil</TableHead>
                      <TableHead>Alta Volatilidad</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Add New Row */}
                    {isAddingNew && (
                      <TableRow className="bg-blue-50">
                        <TableCell>
                          <Select
                            value={newConfig.pair || ""}
                            onValueChange={(value) => setNewConfig((prev) => ({ ...prev, pair: value }))}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Par" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencyPairs.map((pair) => (
                                <SelectItem key={pair} value={pair}>
                                  {pair}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
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
                          <Input
                            type="number"
                            step="0.0001"
                            value={newConfig.normalSpread || ""}
                            onChange={(e) =>
                              setNewConfig((prev) => ({ ...prev, normalSpread: Number(e.target.value) }))
                            }
                            placeholder="0.0002"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.0001"
                            value={newConfig.volatileSpread || ""}
                            onChange={(e) =>
                              setNewConfig((prev) => ({ ...prev, volatileSpread: Number(e.target.value) }))
                            }
                            placeholder="0.0004"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.0001"
                            value={newConfig.highVolatileSpread || ""}
                            onChange={(e) =>
                              setNewConfig((prev) => ({ ...prev, highVolatileSpread: Number(e.target.value) }))
                            }
                            placeholder="0.0008"
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
                    {spreadConfigs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell className="font-medium">{config.pair}</TableCell>
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
                            <Input
                              type="number"
                              step="0.0001"
                              value={newConfig.normalSpread ?? config.normalSpread}
                              onChange={(e) =>
                                setNewConfig((prev) => ({ ...prev, normalSpread: Number(e.target.value) }))
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="font-mono">{config.normalSpread.toFixed(4)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === config.id ? (
                            <Input
                              type="number"
                              step="0.0001"
                              value={newConfig.volatileSpread ?? config.volatileSpread}
                              onChange={(e) =>
                                setNewConfig((prev) => ({ ...prev, volatileSpread: Number(e.target.value) }))
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="font-mono">{config.volatileSpread.toFixed(4)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === config.id ? (
                            <Input
                              type="number"
                              step="0.0001"
                              value={newConfig.highVolatileSpread ?? config.highVolatileSpread}
                              onChange={(e) =>
                                setNewConfig((prev) => ({ ...prev, highVolatileSpread: Number(e.target.value) }))
                              }
                              className="w-24"
                            />
                          ) : (
                            <span className="font-mono">{config.highVolatileSpread.toFixed(4)}</span>
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
            </TabsContent>

            <TabsContent value="scenarios">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      <Badge variant="default">Normal</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Condiciones normales de mercado con volatilidad estándar.
                    </p>
                    <div className="space-y-2">
                      {currencyPairs.slice(0, 4).map((pair) => {
                        const config = spreadConfigs.find((c) => c.pair === pair)
                        return (
                          <div key={pair} className="flex justify-between text-sm">
                            <span>{pair}:</span>
                            <span className="font-mono">{config ? config.normalSpread.toFixed(4) : "N/A"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      <Badge variant="secondary">Volátil</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Mercado con volatilidad elevada, mayor riesgo.</p>
                    <div className="space-y-2">
                      {currencyPairs.slice(0, 4).map((pair) => {
                        const config = spreadConfigs.find((c) => c.pair === pair)
                        return (
                          <div key={pair} className="flex justify-between text-sm">
                            <span>{pair}:</span>
                            <span className="font-mono">{config ? config.volatileSpread.toFixed(4) : "N/A"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">
                      <Badge variant="destructive">Alta Volatilidad</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">Condiciones extremas de mercado, máximo riesgo.</p>
                    <div className="space-y-2">
                      {currencyPairs.slice(0, 4).map((pair) => {
                        const config = spreadConfigs.find((c) => c.pair === pair)
                        return (
                          <div key={pair} className="flex justify-between text-sm">
                            <span>{pair}:</span>
                            <span className="font-mono">{config ? config.highVolatileSpread.toFixed(4) : "N/A"}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
