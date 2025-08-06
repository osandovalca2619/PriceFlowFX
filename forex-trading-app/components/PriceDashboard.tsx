// forex-trading-app/components/PriceDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePriceSimple, usePriceServiceAuth } from '@/hooks/usePrice';
import { FXPrice } from '@/lib/api/priceService';

interface PriceCardProps {
  price: FXPrice;
  isLoading?: boolean;
  error?: string | null;
}

function PriceCard({ price, isLoading, error }: PriceCardProps) {
  const formatPrice = (value: number) => {
    const isJPY = price.quoteCurrency === 'JPY';
    return value.toFixed(isJPY ? 3 : 5);
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getBidAskSpreadColor = (spread: number) => {
    if (spread < 0.0005) return 'text-green-600';
    if (spread < 0.002) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {price.baseCurrency}/{price.quoteCurrency}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {price.source} • {formatTimestamp(price.timestamp)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          )}
          <div className={`w-3 h-3 rounded-full ${
            error ? 'bg-red-500' : (price.marketHours ? 'bg-green-500' : 'bg-orange-500')
          }`}></div>
        </div>
      </div>

      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <div className="space-y-3">
          {/* Bid/Ask */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Bid</p>
              <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(price.bid)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Mid</p>
              <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                {formatPrice(price.mid)}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Ask</p>
              <p className="text-lg font-mono font-bold text-red-600 dark:text-red-400">
                {formatPrice(price.offer)}
              </p>
            </div>
          </div>

          {/* Spread */}
          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">Spread</p>
            <p className={`text-sm font-mono font-bold ${getBidAskSpreadColor(price.spread)}`}>
              {formatPrice(price.spread)} ({((price.spread / price.mid) * 100).toFixed(3)}%)
            </p>
          </div>

          {/* Market Status */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
            <span className="text-xs text-gray-500">Market:</span>
            <span className={`text-xs font-medium ${
              price.marketHours ? 'text-green-600' : 'text-orange-600'
            }`}>
              {price.marketHours ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar un precio individual usando el hook simple
function PriceDisplay({ currencyPair }: { currencyPair: string }) {
  const { price, isConnected, isLoading, error } = usePriceSimple(currencyPair);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800 dark:text-red-400">{currencyPair}</h3>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        <div className="flex items-center mt-2">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          <span className="text-xs text-red-600 dark:text-red-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    );
  }

  if (!price) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{currencyPair}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">No data available</p>
        <div className="flex items-center mt-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    );
  }

  return <PriceCard price={price} isLoading={isLoading} error={error} />;
}

// Componente principal del dashboard
export default function PriceDashboard() {
  const { isInitialized, error: authError, initialize } = usePriceServiceAuth();
  const [selectedPairs, setSelectedPairs] = useState(['EURUSD', 'GBPUSD', 'USDJPY']);
  const [isManualRetry, setIsManualRetry] = useState(false);

  // ✅ CORREGIDO: Usar 'access_token' en lugar de 'auth_token'
  useEffect(() => {
    const token = localStorage.getItem('access_token'); // ✅ CORREGIDO
    if (token && !isInitialized && !authError) {
      console.log('🔐 Initializing price service with token:', token.substring(0, 20) + '...');
      initialize(token);
    }
  }, [initialize, isInitialized, authError]);

  const handleRetryConnection = async () => {
    setIsManualRetry(true);
    const token = localStorage.getItem('access_token'); // ✅ CORREGIDO
    if (token) {
      console.log('🔄 Retrying connection with token:', token.substring(0, 20) + '...');
      await initialize(token);
    } else {
      console.error('❌ No access token found for retry');
    }
    setIsManualRetry(false);
  };

  if (authError && !isInitialized) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">
            Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-400">{authError}</p>
          <button 
            onClick={handleRetryConnection}
            disabled={isManualRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isManualRetry && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            )}
            {isManualRetry ? 'Connecting...' : 'Retry Connection'}
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mr-3"></div>
          <span className="text-gray-700 dark:text-gray-300">Connecting to price service...</span>
        </div>
      </div>
    );
  }

  const availablePairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 
    'NZDUSD', 'EURJPY', 'GBPJPY', 'EURGBP', 'USDCLP'
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Live FX Prices
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time currency prices from PriceFlowFX
        </p>
      </div>

      {/* Selector de pares */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Currency Pairs
        </label>
        <div className="flex flex-wrap gap-2">
          {availablePairs.map(pair => (
            <button
              key={pair}
              onClick={() => {
                if (selectedPairs.includes(pair)) {
                  setSelectedPairs(prev => prev.filter(p => p !== pair));
                } else if (selectedPairs.length < 6) {
                  setSelectedPairs(prev => [...prev, pair]);
                }
              }}
              disabled={!selectedPairs.includes(pair) && selectedPairs.length >= 6}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedPairs.includes(pair)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : selectedPairs.length >= 6
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {pair}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Select up to 6 currency pairs to monitor ({selectedPairs.length}/6 selected)
        </p>
      </div>

      {/* Grid de precios */}
      {selectedPairs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedPairs.map(pair => (
            <PriceDisplay key={pair} currencyPair={pair} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Select currency pairs above to view live prices
          </p>
        </div>
      )}

      {/* Footer con información de conexión */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Connected to PriceFlowFX</span>
          </div>
          <span className="text-gray-500 dark:text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Exportar también el componente de precio individual por si se necesita
export { PriceDisplay };