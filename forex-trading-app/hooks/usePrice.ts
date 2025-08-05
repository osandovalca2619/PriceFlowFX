// forex-trading-app/hooks/usePrice.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { priceService, FXPrice } from '@/lib/api/priceService';

interface UsePriceOptions {
  autoConnect?: boolean;
  reconnectOnError?: boolean;
}

interface UsePriceReturn {
  price: FXPrice | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  subscribe: () => Promise<() => void>;
  unsubscribe: () => void;
  refresh: () => Promise<void>;
}

/**
 * Hook para suscribirse a precios en tiempo real de un par de divisas
 */
export function usePrice(
  currencyPair: string,
  options: UsePriceOptions = {}
): UsePriceReturn {
  const { autoConnect = true, reconnectOnError = true } = options;
  
  const [price, setPrice] = useState<FXPrice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const currencyPairRef = useRef(currencyPair);

  // Actualizar ref cuando cambie el par
  useEffect(() => {
    currencyPairRef.current = currencyPair;
  }, [currencyPair]);

  // Callback para manejar actualizaciones de precios
  const handlePriceUpdate = useCallback((newPrice: FXPrice) => {
    setPrice(newPrice);
    setError(null);
    setIsLoading(false);
  }, []);

  // Callback para manejar cambios de conexión
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    if (!connected && reconnectOnError) {
      setError('Connection lost - attempting to reconnect...');
    }
  }, [reconnectOnError]);

  // Callback para manejar errores
  const handleError = useCallback((err: any) => {
    setError(err.message || 'Error in price service');
    setIsLoading(false);
  }, []);

  // Función para suscribirse
  const subscribe = useCallback(async () => {
    if (!currencyPairRef.current) return () => {};

    setIsLoading(true);
    setError(null);

    try {
      const unsubscribeFn = await priceService.subscribe(
        currencyPairRef.current,
        handlePriceUpdate
      );

      unsubscribeRef.current = unsubscribeFn;
      setIsConnected(priceService.isConnected());
      
      return unsubscribeFn;
    } catch (err: any) {
      setError(err.message || 'Error al suscribirse a precios');
      setIsLoading(false);
      setIsConnected(false);
      return () => {};
    }
  }, [handlePriceUpdate]);

  // Función para desuscribirse
  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Función para refrescar precio actual (no implementada en WebSocket)
  const refresh = useCallback(async () => {
    if (!currencyPairRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // En lugar de getCurrentPrice, podemos re-suscribir para obtener el último precio
      console.log('Refresh not implemented for WebSocket - using subscription instead');
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error al obtener precio actual');
      setIsLoading(false);
    }
  }, []);

  // Configurar listeners del servicio
  useEffect(() => {
    priceService.onConnection(handleConnectionChange);
    priceService.onErrorEvent(handleError);

    return () => {
      // Note: No hay método para remover listeners específicos en la implementación actual
      // En una implementación real, deberías implementar removeListener methods
    };
  }, [handleConnectionChange, handleError]);

  // Auto-suscripción al montar el componente
  useEffect(() => {
    if (autoConnect && currencyPair) {
      let unsubscribeFn: (() => void) | null = null;
      let isMounted = true;

      const setupSubscription = async () => {
        try {
          const unsubscribeFunction = await subscribe();
          if (isMounted) {
            unsubscribeFn = unsubscribeFunction;
          } else {
            // Si el componente se desmontó mientras esperábamos, desuscribir inmediatamente
            unsubscribeFunction();
          }
        } catch (error) {
          console.error('Failed to auto-subscribe:', error);
        }
      };

      setupSubscription();
      
      return () => {
        isMounted = false;
        if (unsubscribeFn) {
          unsubscribeFn();
        }
      };
    }
  }, [currencyPair, autoConnect, subscribe]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  return {
    price,
    isConnected,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    refresh,
  };
}

/**
 * Hook para manejar múltiples suscripciones de precios
 */
export function useMultiplePrices(currencyPairs: string[]) {
  const [prices, setPrices] = useState<Map<string, FXPrice>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  const unsubscribeFunctions = useRef<Map<string, () => void>>(new Map());

  const handlePriceUpdate = useCallback((currencyPair: string) => {
    return (price: FXPrice) => {
      setPrices(prev => new Map(prev.set(currencyPair, price)));
      setErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(currencyPair);
        return newErrors;
      });
    };
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  const subscribeAll = useCallback(async () => {
    setIsLoading(true);
    
    const subscriptionPromises = currencyPairs.map(async (pair) => {
      try {
        const unsubscribeFn = await priceService.subscribe(pair, handlePriceUpdate(pair));
        unsubscribeFunctions.current.set(pair, unsubscribeFn);
        return { pair, success: true };
      } catch (err: any) {
        setErrors(prev => new Map(prev.set(pair, err.message)));
        return { pair, success: false, error: err.message };
      }
    });

    await Promise.allSettled(subscriptionPromises);
    setIsConnected(priceService.isConnected());
    setIsLoading(false);
  }, [currencyPairs, handlePriceUpdate]);

  const unsubscribeAll = useCallback(() => {
    unsubscribeFunctions.current.forEach(unsubscribeFn => {
      unsubscribeFn();
    });
    unsubscribeFunctions.current.clear();
    setIsConnected(false);
  }, []);

  // Configurar listeners del servicio
  useEffect(() => {
    priceService.onConnection(handleConnectionChange);
  }, [handleConnectionChange]);

  useEffect(() => {
    if (currencyPairs.length > 0) {
      subscribeAll();
    }

    return () => {
      unsubscribeAll();
    };
  }, [currencyPairs, subscribeAll, unsubscribeAll]);

  return {
    prices,
    isConnected,
    isLoading,
    errors,
    subscribeAll,
    unsubscribeAll,
    getPriceForPair: (pair: string) => prices.get(pair) || null,
    getErrorForPair: (pair: string) => errors.get(pair) || null,
  };
}

/**
 * Hook simplificado para suscribirse a precios (maneja automáticamente la conexión)
 */
export function usePriceSimple(currencyPair: string) {
  const [price, setPrice] = useState<FXPrice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Callback para manejar actualizaciones de precios
  const handlePriceUpdate = useCallback((newPrice: FXPrice) => {
    setPrice(newPrice);
    setError(null);
    setIsLoading(false);
  }, []);

  // Callback para manejar cambios de conexión
  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setError('Connection lost - attempting to reconnect...');
    }
  }, []);

  // Callback para manejar errores
  const handleError = useCallback((err: any) => {
    setError(err.message || 'Error in price service');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!currencyPair) return;

    let unsubscribeFn: (() => void) | null = null;
    let isMounted = true;

    const setupConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Configurar listeners
        priceService.onConnection(handleConnectionChange);
        priceService.onErrorEvent(handleError);

        // Suscribirse al par de divisas
        const unsubscribe = await priceService.subscribe(currencyPair, handlePriceUpdate);
        
        if (isMounted) {
          unsubscribeFn = unsubscribe;
          setIsConnected(priceService.isConnected());
          setIsLoading(false);
        } else {
          // Componente desmontado durante la suscripción
          unsubscribe();
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || 'Failed to subscribe to price updates');
          setIsLoading(false);
        }
      }
    };

    setupConnection();

    return () => {
      isMounted = false;
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [currencyPair, handlePriceUpdate, handleConnectionChange, handleError]);

  return {
    price,
    isConnected,
    isLoading,
    error,
  };
}
export function usePriceServiceStats() {
  const [stats, setStats] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleStats = (newStats: any) => {
      setStats(newStats);
    };

    const handleConnection = (connected: boolean) => {
      setIsConnected(connected);
    };

    priceService.onStats(handleStats);
    priceService.onConnection(handleConnection);

    // Verificar estado inicial
    setIsConnected(priceService.isConnected());

    return () => {
      // Cleanup listeners if implemented
    };
  }, []);

  return {
    stats,
    isConnected,
    requestStats: () => priceService.getSubscriptions(),
  };
}

/**
 * Hook para inicializar el servicio de precios con autenticación
 */
export function usePriceServiceAuth() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async (token: string) => {
    try {
      priceService.setAuthToken(token);
      await priceService.connect();
      setIsInitialized(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize price service');
      setIsInitialized(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    priceService.disconnect();
    setIsInitialized(false);
  }, []);

  return {
    isInitialized,
    error,
    initialize,
    disconnect,
  };
}