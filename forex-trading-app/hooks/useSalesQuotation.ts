// hooks/useSalesQuotation.ts - VERSIÓN PRODUCCIÓN
import { useState, useEffect, useCallback, useRef } from 'react';
import { priceService } from '@/lib/api/priceService';
import { usePriceServiceAuth } from '@/hooks/usePrice';
import type { 
  SalesFXPrice, 
  QuoteRequest, 
  QuoteResponse, 
  CapturedOperation,
  SalesQuotationSettings
} from '@/types/sales';

interface UseSalesQuotationReturn {
  selectedPairs: string[];
  prices: Map<string, SalesFXPrice>;
  capturedOperations: CapturedOperation[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  quotationSettings: SalesQuotationSettings;
  
  addPair: (pair: string) => Promise<void>;
  removePair: (pair: string) => void;
  requestQuote: (request: QuoteRequest) => Promise<QuoteResponse>;
  captureOperation: (quote: QuoteResponse) => Promise<CapturedOperation>;
  updateSettings: (settings: Partial<SalesQuotationSettings>) => Promise<void>;
  refreshPrices: () => Promise<void>;
}

export function useSalesQuotation(): UseSalesQuotationReturn {
  // Estados principales
  const [selectedPairs, setSelectedPairs] = useState<string[]>([
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCLP'
  ]);
  const [prices, setPrices] = useState<Map<string, SalesFXPrice>>(new Map());
  const [capturedOperations, setCapturedOperations] = useState<CapturedOperation[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotationSettings, setQuotationSettings] = useState<SalesQuotationSettings>({
    defaultPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCLP'],
    maxQuoteTimeout: 5,
    gridColumns: 4,
    autoRefreshInterval: 2000
  });

  // Referencias para manejar suscripciones
  const subscriptionsRef = useRef<Map<string, () => void>>(new Map());
  const isMountedRef = useRef(true);
  const currentPairsRef = useRef<string[]>(selectedPairs);

  // Hook de autenticación
  const { isInitialized, error: authError, initialize } = usePriceServiceAuth();

  // Asegurar que isMountedRef se mantiene durante la vida del componente
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Actualizar ref cuando cambien los pares
  useEffect(() => {
    currentPairsRef.current = selectedPairs;
  }, [selectedPairs]);

  // Convertir FXPrice a SalesFXPrice
  const convertToSalesPrice = useCallback((fxPrice: any, currencyPair: string): SalesFXPrice => {
    if (!fxPrice || typeof fxPrice !== 'object') {
      throw new Error(`Invalid price data for ${currencyPair}`);
    }

    const bid = fxPrice.bid;
    const offer = fxPrice.offer || fxPrice.ask;
    
    if (typeof bid !== 'number' || typeof offer !== 'number') {
      throw new Error(`Missing bid/offer for ${currencyPair}`);
    }

    const spread = fxPrice.spread || Math.abs(offer - bid);
    
    return {
      id: fxPrice.id || `${currencyPair}-${Date.now()}`,
      currencyPair: fxPrice.currencyPair || currencyPair,
      baseCurrency: fxPrice.baseCurrency || currencyPair.substring(0, 3),
      quoteCurrency: fxPrice.quoteCurrency || currencyPair.substring(3, 6),
      bid: bid,
      offer: offer,
      spread: spread,
      bidSpread: spread / 2,
      askSpread: spread / 2,
      timestamp: fxPrice.timestamp ? new Date(fxPrice.timestamp) : new Date(),
      source: fxPrice.source || 'PriceFlowFX',
      marketHours: fxPrice.marketHours !== undefined ? fxPrice.marketHours : true
    };
  }, []);

  // Callback para actualizaciones de precio
  const handlePriceUpdate = useCallback((currencyPair: string, fxPrice: any) => {
    if (!isMountedRef.current) return;

    try {
      const salesPrice = convertToSalesPrice(fxPrice, currencyPair);
      
      setPrices(prev => {
        const newMap = new Map(prev);
        newMap.set(currencyPair, salesPrice);
        return newMap;
      });
      
      setError(null);
    } catch (err: any) {
      console.error(`Error processing price for ${currencyPair}:`, err.message);
      setError(`Error procesando precio para ${currencyPair}: ${err.message}`);
    }
  }, [convertToSalesPrice]);

  // Suscribirse a un par
  const subscribeToPair = useCallback(async (pair: string) => {
    try {
      if (!isInitialized || subscriptionsRef.current.has(pair)) return;

      const pairCallback = (eventData: any) => {
        let fxPrice = eventData;
        
        // Extraer datos si es un evento con estructura {type, data, timestamp}
        if (eventData && typeof eventData === 'object' && eventData.type === 'price_update') {
          fxPrice = eventData.data;
        }
        
        if (fxPrice && typeof fxPrice === 'object' && fxPrice.data) {
          fxPrice = fxPrice.data;
        }
        
        handlePriceUpdate(pair, fxPrice);
      };
      
      const unsubscribe = await priceService.subscribe(pair, pairCallback);
      subscriptionsRef.current.set(pair, unsubscribe);
      
    } catch (err: any) {
      console.error(`Error subscribing to ${pair}:`, err.message);
      setError(`Error al suscribirse a ${pair}: ${err.message}`);
    }
  }, [isInitialized, handlePriceUpdate]);

  // Desuscribirse de un par
  const unsubscribeFromPair = useCallback((pair: string) => {
    const unsubscribe = subscriptionsRef.current.get(pair);
    if (unsubscribe) {
      unsubscribe();
      subscriptionsRef.current.delete(pair);
      
      setPrices(prev => {
        const newMap = new Map(prev);
        newMap.delete(pair);
        return newMap;
      });
    }
  }, []);

  // Manejar cambios de conexión
  const handleConnectionChange = useCallback((connected: boolean) => {
    if (!isMountedRef.current) return;
    setIsConnected(connected);
    
    if (!connected) {
      setError('Conexión perdida - intentando reconectar...');
    } else {
      setError(null);
    }
  }, []);

  // Manejar errores
  const handleError = useCallback((err: any) => {
    if (!isMountedRef.current) return;
    console.error('Sales price service error:', err.message);
    setError(err.message || 'Error en el servicio de precios');
  }, []);

  // Funciones de acción
  const addPair = useCallback(async (pair: string): Promise<void> => {
    if (currentPairsRef.current.includes(pair)) return;

    if (pair.length !== 6) {
      setError('El par de divisa debe tener 6 caracteres (ej: EURUSD)');
      return;
    }

    try {
      setSelectedPairs(prev => {
        if (prev.includes(pair)) return prev;
        return [...prev, pair];
      });
      
      if (isInitialized) {
        await subscribeToPair(pair);
      }
    } catch (err: any) {
      console.error(`Error adding pair ${pair}:`, err.message);
      setSelectedPairs(prev => prev.filter(p => p !== pair));
      setError(err.message);
    }
  }, [isInitialized, subscribeToPair]);

  const removePair = useCallback((pair: string): void => {
    setSelectedPairs(prev => prev.filter(p => p !== pair));
    unsubscribeFromPair(pair);
  }, [unsubscribeFromPair]);

  const requestQuote = useCallback(async (request: QuoteRequest): Promise<QuoteResponse> => {
    try {
      setIsLoading(true);
      
      const currentPrice = prices.get(request.currencyPair);
      if (!currentPrice) {
        throw new Error(`No hay precio disponible para ${request.currencyPair}`);
      }

      const marketPrice = request.direction === 'buy' ? currentPrice.offer : currentPrice.bid;
      const spreadToApply = request.direction === 'buy' ? currentPrice.askSpread : currentPrice.bidSpread;
      
      let additionalSpread = 0;
      if (request.amount > 1000000) {
        additionalSpread = spreadToApply * 0.5;
      } else if (request.amount < 100000) {
        additionalSpread = spreadToApply * 1.5;
      } else {
        additionalSpread = spreadToApply;
      }

      const quotedPrice = request.direction === 'buy' 
        ? marketPrice + additionalSpread 
        : marketPrice - additionalSpread;

      return {
        quoteId: `QT${Date.now()}`,
        currencyPair: request.currencyPair,
        marketPrice,
        quotedPrice,
        spread: additionalSpread,
        amount: request.amount,
        equivalentAmount: request.amount * quotedPrice,
        direction: request.direction,
        expiresAt: new Date(Date.now() + 5000),
        timestamp: new Date()
      };
    } catch (err: any) {
      console.error('Error generating quote:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [prices]);

  const captureOperation = useCallback(async (quote: QuoteResponse): Promise<CapturedOperation> => {
    try {
      setIsLoading(true);
      
      const operation: CapturedOperation = {
        id: quote.quoteId,
        product: 'Spot',
        pair: quote.currencyPair,
        amount: quote.amount,
        marketPrice: quote.marketPrice,
        quotedPrice: quote.quotedPrice,
        equivalentAmount: quote.equivalentAmount,
        status: 'Pendiente',
        userId: 'USR001',
        client: 'Cliente por defecto',
        timestamp: new Date().toLocaleString(),
        type: quote.direction
      };

      setCapturedOperations(prev => [operation, ...prev]);
      return operation;
    } catch (err: any) {
      console.error('Error capturing operation:', err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<SalesQuotationSettings>): Promise<void> => {
    try {
      const updatedSettings = { ...quotationSettings, ...newSettings };
      localStorage.setItem('sales-quotation-settings', JSON.stringify(updatedSettings));
      setQuotationSettings(updatedSettings);
    } catch (err: any) {
      console.error('Error updating settings:', err.message);
    }
  }, [quotationSettings]);

  const refreshPrices = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const currentPairs = currentPairsRef.current;
      for (const pair of currentPairs) {
        unsubscribeFromPair(pair);
        await subscribeToPair(pair);
      }
    } catch (err: any) {
      console.error('Error refreshing prices:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [subscribeToPair, unsubscribeFromPair]);

  // Inicializar servicio
  useEffect(() => {
    const initializeService = async () => {
      const token = localStorage.getItem('access_token');
      if (token && !isInitialized && !authError) {
        try {
          await initialize(token);
        } catch (err: any) {
          console.error('Failed to initialize price service:', err.message);
        }
      }
    };

    initializeService();
  }, [initialize, isInitialized, authError]);

  // Configurar listeners después de inicializar
  useEffect(() => {
    if (!isInitialized) return;

    priceService.onConnection(handleConnectionChange);
    priceService.onErrorEvent(handleError);
    setIsConnected(priceService.isConnected());

    return () => {
      // Los listeners son globales, no hay cleanup específico
    };
  }, [isInitialized, handleConnectionChange, handleError]);

  // Manejar cambios en selectedPairs
  useEffect(() => {
    if (!isInitialized) return;

    let mounted = true;

    const manageSubscriptions = async () => {
      const subscribedPairs = Array.from(subscriptionsRef.current.keys());
      
      // Desuscribirse de pares que ya no están seleccionados
      for (const pair of subscribedPairs) {
        if (!selectedPairs.includes(pair)) {
          unsubscribeFromPair(pair);
        }
      }
      
      // Suscribirse a nuevos pares
      for (const pair of selectedPairs) {
        if (mounted && !subscriptionsRef.current.has(pair)) {
          try {
            await subscribeToPair(pair);
          } catch (err: any) {
            console.error(`Failed to subscribe to ${pair}:`, err.message);
          }
        }
      }
      
      if (mounted) {
        setIsConnected(priceService.isConnected());
      }
    };

    manageSubscriptions();

    return () => {
      mounted = false;
    };
  }, [isInitialized, selectedPairs, subscribeToPair, unsubscribeFromPair]);

  // Cargar configuración inicial
  useEffect(() => {
    const loadInitialData = () => {
      try {
        const savedSettings = localStorage.getItem('sales-quotation-settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setQuotationSettings(settings);
          if (settings.defaultPairs && settings.defaultPairs.length > 0) {
            setSelectedPairs(settings.defaultPairs);
          }
        }

        setCapturedOperations([]);
      } catch (err: any) {
        console.error('Error loading initial data:', err.message);
        setError('Error al cargar configuración inicial');
      }
    };

    loadInitialData();
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (err: any) {
          console.error('Error during cleanup:', err.message);
        }
      });
      subscriptionsRef.current.clear();
    };
  }, []);

  // Combinar errores
  const combinedError = authError || error;

  return {
    selectedPairs,
    prices,
    capturedOperations,
    isConnected: isInitialized && isConnected,
    isLoading,
    error: combinedError,
    quotationSettings,
    addPair,
    removePair,
    requestQuote,
    captureOperation,
    updateSettings,
    refreshPrices
  };
}