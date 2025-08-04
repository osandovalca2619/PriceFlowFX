"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Users } from "lucide-react"

interface Client {
  rut: string
  name: string
  codigoOrigen: string
}

interface ClientSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (client: Client) => void
}

export function ClientSelector({ isOpen, onClose, onSelect }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo de clientes
  const clients: Client[] = [
    { rut: "12.345.678-9", name: "Juan Pérez González", codigoOrigen: "CLI001" },
    { rut: "98.765.432-1", name: "María García López", codigoOrigen: "CLI002" },
    { rut: "11.222.333-4", name: "Carlos Rodríguez Silva", codigoOrigen: "CLI003" },
    { rut: "55.666.777-8", name: "Ana Martínez Torres", codigoOrigen: "CLI004" },
    { rut: "33.444.555-6", name: "Luis Fernández Ruiz", codigoOrigen: "CLI005" },
    { rut: "77.888.999-0", name: "Carmen Sánchez Morales", codigoOrigen: "CLI006" },
  ]

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rut.includes(searchTerm) ||
      client.codigoOrigen.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Seleccionar Cliente</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, RUT o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Clients Table */}
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Código Origen</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.rut}>
                    <TableCell className="font-mono">{client.rut}</TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.codigoOrigen}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => onSelect(client)}>
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron clientes que coincidan con la búsqueda
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={onClose} className="bg-transparent">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
