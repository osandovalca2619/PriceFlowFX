import React from 'react';
import { TrendingUp, TrendingDown, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedPriceCardProps {
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  bid: number;
  mid: number;
  offer: number;
  spread: number;
  timestamp: Date;
  source: string;
  marketHours: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
  error?: string | null;
  previousPrice?: number;
  onPriceClick?: (type: 'buy' | 'sell', price: number) => void;
}

export const EnhancedPriceCard: React.FC<EnhancedPriceCardProps> = ({
  currencyPair,
  baseCurrency,
  quoteCurrency,
  bid,
  mid,
  offer,
  spread,
  timestamp,
  source,
  marketHours,
  isConnected = true,
  isLoading = false,
  error = null,
  previousPrice,
  onPriceClick
}) => {
  const formatPrice = (value: number) => {
    const isJPY = quoteCurrency === 'JPY';
    return value.toFixed(isJPY ? 3 : 5);
  };

  const getPriceMovement = () => {
    if (!previousPrice || previousPrice === mid) return 'neutral';
    return mid > previousPrice ? 'up' : 'down';
  };

  const movement = getPriceMovement();
  const spreadPercentage = ((spread / mid) * 100).toFixed(3);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-red-800 dark:text-red-200">{currencyPair}</h3>
          <WifiOff className="h-4 w-4 text-red-500" />
        </div>
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 hover:shadow-md",
      "border-gray-200 dark:border-gray-700",
      !marketHours && "opacity-75",
      movement === 'up' && "border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10",
      movement === 'down' && "border-red-200 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10"
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{baseCurrency}/{quoteCurrency}</span>
              {movement !== 'neutral' && (
                movement === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )
              )}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{source}</span>
              <span>•</span>
              <span>{timestamp.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <div className={cn(
              "w-2 h-2 rounded-full",
              marketHours ? "bg-green-500" : "bg-orange-500"
            )}></div>
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => onPriceClick?.('sell', bid)}
            className={cn(
              "p-3 rounded-lg transition-colors text-center group",
              "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
            )}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid</p>
            <p className="text-lg font-mono font-bold text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform">
              {formatPrice(bid)}
            </p>
          </button>

          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mid</p>
            <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
              {formatPrice(mid)}
            </p>
          </div>

          <button
            onClick={() => onPriceClick?.('buy', offer)}
            className={cn(
              "p-3 rounded-lg transition-colors text-center group",
              "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
            )}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ask</p>
            <p className="text-lg font-mono font-bold text-green-600 dark:text-green-400 group-hover:scale-105 transition-transform">
              {formatPrice(offer)}
            </p>
          </button>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">Spread: </span>
            <span className="font-mono font-medium">{formatPrice(spread)} ({spreadPercentage}%)</span>
          </div>
          <div className={cn(
            "text-xs px-2 py-1 rounded-full",
            marketHours 
              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300"
          )}>
            {marketHours ? 'Market Open' : 'Market Closed'}
          </div>
        </div>
      </div>
    </div>
  );
};
