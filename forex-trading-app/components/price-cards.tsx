"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CurrencyPrice {
  id: string
  pair: string
  bid: number
  ask: number
  spread: number
  change: number
  lastUpdate: string
}

interface PriceCardsProps {
  prices: CurrencyPrice[]
  onPriceClick: (price: CurrencyPrice, type: "buy" | "sell") => void
}

export function PriceCards({ prices, onPriceClick }: PriceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {prices.map((price) => (
        <Card key={price.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">{price.pair}</h3>
              <div
                className={`flex items-center justify-center mt-1 ${price.change >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {price.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{price.change.toFixed(2)}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compra (Ask)</span>
                <Button
                  onClick={() => onPriceClick(price, "buy")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-mono"
                >
                  {price.ask.toFixed(4)}
                </Button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Venta (Bid)</span>
                <Button
                  onClick={() => onPriceClick(price, "sell")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-mono"
                >
                  {price.bid.toFixed(4)}
                </Button>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Spread: {price.spread.toFixed(4)}</span>
                  <span>{price.lastUpdate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
