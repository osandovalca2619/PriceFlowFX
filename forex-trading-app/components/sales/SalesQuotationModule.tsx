// components/sales/SalesQuotationModule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calculator,
  Clock,
  Wifi,
  WifiOff,
  X,
  Zap,
  DollarSign,
  Grid3X3,
  LayoutGrid,
  Grip,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSalesQuotation } from '@/hooks/useSalesQuotation';
import type { QuoteResponse, SalesFXPrice } from '@/types/sales';

interface QuoteModalState {
  isOpen: boolean;
  selectedPrice: SalesFXPrice | null;
  direction: 'buy' | 'sell';
}

interface QuoteFormData {
  amount: string;
  comments: string;
}

export default function SalesQuotationModule() {
  // Hook personalizado para la lógica de cotización
  const {
    selectedPairs,
    prices,
    capturedOperations,
    isConnected,
    isLoading,
    error,
    quotationSettings,
    addPair,
    removePair,
    requestQuote,
    captureOperation,
    updateSettings
  } = useSalesQuotation();

  // Estados locales del componente
  const [searchQuery, setSearchQuery] = useState('');
  const [customPair, setCustomPair] = useState('');
  const [isAddingPair, setIsAddingPair] = useState(false);
  const [gridCols, setGridCols] = useState<4 | 6 | 8>(quotationSettings.gridColumns);

  // Estados del modal de cotización
  const [quoteModal, setQuoteModal] = useState<QuoteModalState>({
    isOpen: false,
    selectedPrice: null,
    direction: 'buy'
  });

  // Estados del formulario de cotización
  const [quoteForm, setQuoteForm] = useState<QuoteFormData>({
    amount: '',
    comments: ''
  });

  // Estados de respuesta de cotización
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number | null>(null);

  // Filtrar precios según búsqueda
  const filteredPrices = Array.from(prices.values()).filter(price => 
    selectedPairs.includes(price.currencyPair) &&
    (!searchQuery || price.currencyPair.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Configuración de grid responsivo
  const getGridClass = () => {
    switch(gridCols) {
      case 6: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6';
      case 8: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
      default: return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  // Actualizar precio de mercado en modal abierto
  useEffect(() => {
    if (quoteModal.isOpen && quoteModal.selectedPrice) {
      const currentPrice = prices.get(quoteModal.selectedPrice.currencyPair);
      if (currentPrice) {
        const marketPrice = quoteModal.direction === 'buy' ? currentPrice.offer : currentPrice.bid;
        setCurrentMarketPrice(marketPrice);
      }
    }
  }, [prices, quoteModal.selectedPrice, quoteModal.direction, quoteModal.isOpen]);

  // Countdown del quote
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quoteResponse) {
      setQuoteResponse(null);
    }
  }, [timeLeft, quoteResponse]);

  // Sincronizar grid columns con settings
  useEffect(() => {
    if (gridCols !== quotationSettings.gridColumns) {
      updateSettings({ gridColumns: gridCols });
    }
  }, [gridCols, quotationSettings.gridColumns, updateSettings]);

  const formatPrice = (value: number, pair: string) => {
    const isJPY = pair.includes('JPY');
    const isCLP = pair.includes('CLP');
    if (isCLP) return value.toFixed(2);
    return value.toFixed(isJPY ? 3 : 5);
  };

  const parseAmount = (value: string) => {
    const cleanValue = value.replace(/,/g, '').toUpperCase();
    
    if (cleanValue.endsWith('K')) {
      return parseFloat(cleanValue.slice(0, -1)) * 1000;
    } else if (cleanValue.endsWith('M')) {
      return parseFloat(cleanValue.slice(0, -1)) * 1000000;
    }
    
    return parseFloat(cleanValue) || 0;
  };

  const formatAmountDisplay = (value: string) => {
    const amount = parseAmount(value);
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toLocaleString();
  };

  const handlePriceClick = (price: SalesFXPrice, direction: 'buy' | 'sell') => {
    setQuoteModal({
      isOpen: true,
      selectedPrice: price,
      direction
    });
    setQuoteForm({
      amount: '',
      comments: ''
    });
    setQuoteResponse(null);
    setCurrentMarketPrice(direction === 'buy' ? price.offer : price.bid);
    setTimeLeft(0);
  };

  const handleAddCustomPair = async () => {
    if (customPair && customPair.length === 6) {
      const formattedPair = customPair.toUpperCase();
      try {
        await addPair(formattedPair);
        setCustomPair('');
        setIsAddingPair(false);
      } catch (err) {
        console.error('Error adding pair:', err);
      }
    }
  };

  const handleCalculateQuote = async () => {
    if (!quoteModal.selectedPrice || !quoteForm.amount || !currentMarketPrice) return;

    setIsCalculating(true);
    
    try {
      const amount = parseAmount(quoteForm.amount);
      const response = await requestQuote({
        currencyPair: quoteModal.selectedPrice.currencyPair,
        amount,
        direction: quoteModal.direction,
        userId: 'current-user' // Esto vendría del contexto de auth
      });

      setQuoteResponse(response);
      setTimeLeft(quotationSettings.maxQuoteTimeout);
    } catch (err) {
      console.error('Error calculating quote:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCaptureQuote = async () => {
    if (!quoteResponse) return;
    
    try {
      await captureOperation(quoteResponse);
      closeQuoteModal();
    } catch (err) {
      console.error('Error capturing quote:', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const closeQuoteModal = () => {
    setQuoteModal({ isOpen: false, selectedPrice: null, direction: 'buy' });
    setQuoteForm({ amount: '', comments: '' });
    setQuoteResponse(null);
    setCurrentMarketPrice(null);
    setTimeLeft(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Cotizaciones Sales</span>
              <Badge variant={isConnected ? "default" : "destructive"} className="ml-2">
                {isConnected ? (
                  <><Wifi className="h-3 w-3 mr-1" /> Conectado</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" /> Desconectado</>
                )}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {/* Grid Layout Controls */}
              <div className="flex items-center space-x-1 border rounded-md p-1">
                <Button
                  variant={gridCols === 4 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridCols(4)}
                  className="p-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 6 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridCols(6)}
                  className="p-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridCols === 8 ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setGridCols(8)}
                  className="p-2"
                >
                  <Grip className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingPair(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Par
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar pares de divisas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Pares seleccionados */}
            <div className="flex flex-wrap gap-2">
              {selectedPairs.map(pair => (
                <Badge 
                  key={pair} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                  onClick={() => removePair(pair)}
                >
                  {pair}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>

            {/* Agregar par personalizado */}
            {isAddingPair && (
              <div className="flex space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Input
                  placeholder="EURCLP"
                  value={customPair}
                  onChange={(e) => setCustomPair(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="w-32"
                />
                <Button size="sm" onClick={handleAddCustomPair}>
                  Agregar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsAddingPair(false)}>
                  Cancelar
                </Button>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grid de Precios */}
      <div className={`grid ${getGridClass()} gap-4`}>
        {filteredPrices.slice(0, gridCols * 2).map(price => (
          <Card key={price.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {price.baseCurrency}/{price.quoteCurrency}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{price.source}</span>
                    <span>•</span>
                    <span>{price.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    price.marketHours ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {price.marketHours ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
              </div>

              {/* Precios - Bid (Azul) y Ask (Rojo) */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <button
                    onClick={() => handlePriceClick(price, 'sell')}
                    className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid</p>
                    <p className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      {formatPrice(price.bid, price.currencyPair)}
                    </p>
                  </button>

                  <button
                    onClick={() => handlePriceClick(price, 'buy')}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group"
                  >
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ask</p>
                    <p className="text-sm font-mono font-bold text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
                      {formatPrice(price.offer, price.currencyPair)}
                    </p>
                  </button>
                </div>

                {/* Spreads diferenciados */}
                <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Spread Bid</p>
                      <p className="font-mono text-blue-600 dark:text-blue-400">
                        {formatPrice(price.bidSpread, price.currencyPair)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Spread Ask</p>
                      <p className="font-mono text-red-600 dark:text-red-400">
                        {formatPrice(price.askSpread, price.currencyPair)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Estado vacío */}
      {filteredPrices.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <DollarSign className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay precios disponibles
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No se encontraron pares que coincidan con tu búsqueda' : 'Agrega pares de divisas para ver los precios'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando precios...</p>
          </CardContent>
        </Card>
      )}

      {/* Grid de Operaciones Capturadas */}
      {capturedOperations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Operaciones Capturadas ({capturedOperations.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Operación</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Par</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Precio Mercado</TableHead>
                  <TableHead>Precio Cliente</TableHead>
                  <TableHead>Equivalente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Cliente</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {capturedOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{op.id}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(op.id)}
                          className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                        {op.product}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{op.pair}</TableCell>
                    <TableCell>{op.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-gray-700 dark:text-gray-300">
                      {formatPrice(op.marketPrice, op.pair)}
                    </TableCell>
                    <TableCell className={`font-mono font-bold ${
                      op.type === 'buy' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {formatPrice(op.quotedPrice, op.pair)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {op.equivalentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                        {op.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{op.userId}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{op.client}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal de Cotización */}
      <Dialog open={quoteModal.isOpen} onOpenChange={() => closeQuoteModal()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Cotizar {quoteModal.selectedPrice?.currencyPair}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Precio de mercado actualizado */}
            {quoteModal.selectedPrice && currentMarketPrice && (
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Precio Mercado ({quoteModal.direction === 'buy' ? 'Ask' : 'Bid'}):
                  </span>
                  <span className={`font-mono font-bold text-lg ${
                    quoteModal.direction === 'buy' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {formatPrice(currentMarketPrice, quoteModal.selectedPrice.currencyPair)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Operación:</span>
                  <Badge variant={quoteModal.direction === 'buy' ? "destructive" : "default"}>
                    {quoteModal.direction === 'buy' ? 'COMPRA' : 'VENTA'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Spread {quoteModal.direction === 'buy' ? 'Ask' : 'Bid'}:
                  </span>
                  <span className="font-mono text-sm">
                    {formatPrice(
                      quoteModal.direction === 'buy' ? quoteModal.selectedPrice.askSpread : quoteModal.selectedPrice.bidSpread, 
                      quoteModal.selectedPrice.currencyPair
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-3">
              <div>
                <Label>Monto (use K para miles, M para millones)</Label>
                <Input
                  type="text"
                  placeholder="100K, 1.5M, 500000"
                  value={quoteForm.amount}
                  onChange={(e) => setQuoteForm(prev => ({ ...prev, amount: e.target.value }))}
                />
                {quoteForm.amount && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Monto: ${formatAmountDisplay(quoteForm.amount)}
                  </p>
                )}
              </div>
            </div>

            {/* Respuesta de cotización con timer */}
            {quoteResponse && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">Cotización</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-3">
                  <Progress value={(timeLeft / quotationSettings.maxQuoteTimeout) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio Mercado:</span>
                    <span className="font-mono">{formatPrice(quoteResponse.marketPrice, quoteResponse.currencyPair)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio Cotizado:</span>
                    <span className={`font-mono font-bold text-lg ${
                      quoteResponse.direction === 'buy' ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      {formatPrice(quoteResponse.quotedPrice, quoteResponse.currencyPair)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spread Aplicado:</span>
                    <span className="font-mono">{formatPrice(quoteResponse.spread, quoteResponse.currencyPair)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto Equivalente:</span>
                    <span className="font-mono font-bold">${quoteResponse.equivalentAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Botón capturar solo visible durante el tiempo activo */}
                {timeLeft > 0 && (
                  <Button 
                    onClick={handleCaptureQuote}
                    className="w-full mt-3 bg-green-600 hover:bg-green-700"
                  >
                    Capturar Operación
                  </Button>
                )}
              </div>
            )}

            {/* Acciones */}
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" onClick={closeQuoteModal} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleCalculateQuote}
                disabled={
                !quoteForm.amount || 
                isCalculating || 
                (quoteResponse !== null && timeLeft > 0)
                }
                className="flex-1"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Calculando...
                  </>
                ) : (
                  'Cotizar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}