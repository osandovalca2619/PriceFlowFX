// hooks/usePrice.ts
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
  subscribe: () => () => void;
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

  // Función para suscribirse
  const subscribe = useCallback(() => {
    if (!currencyPairRef.current) return () => {};

    setIsLoading(true);
    setError(null);

    try {
      const unsubscribeFn = priceService.subscribe(
        currencyPairRef.current,
        handlePriceUpdate
      );

      unsubscribeRef.current = unsubscribeFn;
      setIsConnected(true);
      
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
    setIsConnected(false);
    setIsLoading(false);
  }, []);

  // Función para refrescar precio actual
  const refresh = useCallback(async () => {
    if (!currencyPairRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPrice = await priceService.getCurrentPrice(currencyPairRef.current);
      setPrice(currentPrice);
    } catch (err: any) {
      setError(err.message || 'Error al obtener precio actual');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-suscripción al montar el componente
  useEffect(() => {
    if (autoConnect && currencyPair) {
      const unsubscribeFn = subscribe();
      
      return () => {
        unsubscribeFn();
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

  const subscribeAll = useCallback(() => {
    setIsLoading(true);
    
    currencyPairs.forEach(pair => {
      try {
        const unsubscribeFn = priceService.subscribe(pair, handlePriceUpdate(pair));
        unsubscribeFunctions.current.set(pair, unsubscribeFn);
      } catch (err: any) {
        setErrors(prev => new Map(prev.set(pair, err.message)));
      }
    });

    setIsConnected(true);
    setIsLoading(false);
  }, [currencyPairs, handlePriceUpdate]);

  const unsubscribeAll = useCallback(() => {
    unsubscribeFunctions.current.forEach(unsubscribeFn => {
      unsubscribeFn();
    });
    unsubscribeFunctions.current.clear();
    setIsConnected(false);
  }, []);

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