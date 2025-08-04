"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Save, X, Trash2, Search } from "lucide-react"

interface Client {
  id: string
  rut: string
  name: string
  idSistemaOrigen: string
  idSistemaDestino: string
  segmento: string
}

export function ClientsManager({ user }) {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      rut: "12.345.678-9",
      name: "Juan Pérez González",
      idSistemaOrigen: "CLI001",
      idSistemaDestino: "DEST001",
      segmento: "Premium",
    },
    {
      id: "2",
      rut: "98.765.432-1",
      name: "María García López",
      idSistemaOrigen: "CLI002",
      idSistemaDestino: "DEST002",
      segmento: "Corporate",
    },
    {
      id: "3",
      rut: "11.222.333-4",
      name: "Carlos Rodríguez Silva",
      idSistemaOrigen: "CLI003",
      idSistemaDestino: "DEST003",
      segmento: "Retail",
    },
  ])

  const [newClient, setNewClient] = useState<Partial<Client>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Client>>({})
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Filters
  const [filterRut, setFilterRut] = useState("")
  const [filterName, setFilterName] = useState("")
  const [filterSegment, setFilterSegment] = useState("all")

  const segments = ["Premium", "Corporate", "Retail", "Private"]

  const filteredClients = clients.filter((client) => {
    return (
      (filterRut === "" || client.rut.includes(filterRut)) &&
      (filterName === "" || client.name.toLowerCase().includes(filterName.toLowerCase())) &&
      (filterSegment === "all" || client.segmento === filterSegment)
    )
  })

  const handleAddNew = () => {
    if (newClient.rut && newClient.name && newClient.idSistemaOrigen && newClient.segmento) {
      const client: Client = {
        id: Date.now().toString(),
        rut: newClient.rut,
        name: newClient.name,
        idSistemaOrigen: newClient.idSistemaOrigen,
        idSistemaDestino: newClient.idSistemaDestino || "",
        segmento: newClient.segmento,
      }
      setClients((prev) => [...prev, client])
      setNewClient({})
      setIsAddingNew(false)
    }
  }

  const handleEdit = (client: Client) => {
    setEditingId(client.id)
    setEditData({ ...client })
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setClients((prev) =>
        prev.map((client) => (client.id === editingId ? ({ ...client, ...editData } as Client) : client)),
      )
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este cliente?")) {
      setClients((prev) => prev.filter((client) => client.id !== id))
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
    setIsAddingNew(false)
    setNewClient({})
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Mantenedor de Clientes</span>
            </div>
            <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <h3 className="font-medium mb-4">Agregar Nuevo Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">RUT *</label>
                  <Input
                    value={newClient.rut || ""}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, rut: e.target.value }))}
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input
                    value={newClient.name || ""}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ID Sistema Origen *</label>
                  <Input
                    value={newClient.idSistemaOrigen || ""}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, idSistemaOrigen: e.target.value }))}
                    placeholder="CLI001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ID Sistema Destino</label>
                  <Input
                    value={newClient.idSistemaDestino || ""}
                    onChange={(e) => setNewClient((prev) => ({ ...prev, idSistemaDestino: e.target.value }))}
                    placeholder="DEST001"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Segmento *</label>
                  <Select
                    value={newClient.segmento || ""}
                    onValueChange={(value) => setNewClient((prev) => ({ ...prev, segmento: value }))}
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
              <label className="text-sm font-medium">Filtrar por RUT</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={filterRut}
                  onChange={(e) => setFilterRut(e.target.value)}
                  placeholder="12.345.678-9"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Filtrar por Nombre</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="pl-10"
                />
              </div>
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

          {/* Clients Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>ID Sistema Origen</TableHead>
                  <TableHead>ID Sistema Destino</TableHead>
                  <TableHead>Segmento</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-mono">
                      {editingId === client.id ? (
                        <Input
                          value={editData.rut || client.rut}
                          onChange={(e) => setEditData((prev) => ({ ...prev, rut: e.target.value }))}
                          className="w-32"
                        />
                      ) : (
                        client.rut
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {editingId === client.id ? (
                        <Input
                          value={editData.name || client.name}
                          onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-48"
                        />
                      ) : (
                        client.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === client.id ? (
                        <Input
                          value={editData.idSistemaOrigen || client.idSistemaOrigen}
                          onChange={(e) => setEditData((prev) => ({ ...prev, idSistemaOrigen: e.target.value }))}
                          className="w-24"
                        />
                      ) : (
                        client.idSistemaOrigen
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === client.id ? (
                        <Input
                          value={editData.idSistemaDestino || client.idSistemaDestino}
                          onChange={(e) => setEditData((prev) => ({ ...prev, idSistemaDestino: e.target.value }))}
                          className="w-24"
                        />
                      ) : (
                        client.idSistemaDestino
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === client.id ? (
                        <Select
                          value={editData.segmento || client.segmento}
                          onValueChange={(value) => setEditData((prev) => ({ ...prev, segmento: value }))}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {segments.map((segment) => (
                              <SelectItem key={segment} value={segment}>
                                {segment}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline">{client.segmento}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === client.id ? (
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
                          <Button size="sm" variant="outline" onClick={() => handleEdit(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(client.id)}>
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

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">No se encontraron clientes con los filtros aplicados</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
