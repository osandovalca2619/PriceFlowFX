// forex-trading-app/components/PriceComponent.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePriceSimple, usePriceServiceAuth } from '@/hooks/usePrice';

// Componente para mostrar un precio individual
function PriceDisplay({ currencyPair }: { currencyPair: string }) {
  const { price, isConnected, isLoading, error } = usePriceSimple(currencyPair);

  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h3 className="font-semibold text-red-800">{currencyPair}</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!price) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800">{currencyPair}</h3>
        <p className="text-gray-600 text-sm">No data available</p>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    const isJPY = price.quoteCurrency === 'JPY';
    return value.toFixed(isJPY ? 3 : 5);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {price.baseCurrency}/{price.quoteCurrency}
          </h3>
          <p className="text-xs text-gray-500">
            {new Date(price.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-xs text-gray-500">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-gray-500">Bid</p>
          <p className="text-lg font-mono font-bold text-blue-600">
            {formatPrice(price.bid)}
          </p>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <p className="text-xs text-gray-500">Mid</p>
          <p className="text-lg font-mono font-bold text-gray-900">
            {formatPrice(price.mid)}
          </p>
        </div>
        <div className="bg-red-50 rounded p-2">
          <p className="text-xs text-gray-500">Ask</p>
          <p className="text-lg font-mono font-bold text-red-600">
            {formatPrice(price.offer)}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Spread:</span>
          <span className="font-mono">{formatPrice(price.spread)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Source:</span>
          <span>{price.source}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Market:</span>
          <span className={price.marketHours ? 'text-green-600' : 'text-orange-600'}>
            {price.marketHours ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Componente principal del dashboard
export default function PriceDashboard() {
  const { isInitialized, error: authError, initialize } = usePriceServiceAuth();
  const [selectedPairs, setSelectedPairs] = useState(['EURUSD', 'GBPUSD', 'USDJPY']);

  // Simular token JWT (en tu app real, obtienes esto del contexto de auth)
  useEffect(() => {
    const token = localStorage.getItem('auth_token'); // o desde tu contexto de auth
    if (token && !isInitialized) {
      initialize(token);
    }
  }, [initialize, isInitialized]);

  if (authError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Connection Error
          </h2>
          <p className="text-red-600">{authError}</p>
          <button 
            onClick={() => {
              const token = localStorage.getItem('auth_token');
              if (token) initialize(token);
            }}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry Connection
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
          <span>Connecting to price service...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Live FX Prices
        </h1>
        <p className="text-gray-600">
          Real-time currency prices from PriceFlowFX
        </p>
      </div>

      {/* Selector de pares */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency Pairs
        </label>
        <div className="flex flex-wrap gap-2">
          {['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'USDCLP'].map(pair => (
            <button
              key={pair}
              onClick={() => {
                if (selectedPairs.includes(pair)) {
                  setSelectedPairs(prev => prev.filter(p => p !== pair));
                } else if (selectedPairs.length < 6) {
                  setSelectedPairs(prev => [...prev, pair]);
                }
              }}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedPairs.includes(pair)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pair}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select up to 6 currency pairs to monitor
        </p>
      </div>

      {/* Grid de precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedPairs.map(pair => (
          <PriceDisplay key={pair} currencyPair={pair} />
        ))}
      </div>

      {selectedPairs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Select currency pairs above to view live prices
          </p>
        </div>
      )}
    </div>
  );
}