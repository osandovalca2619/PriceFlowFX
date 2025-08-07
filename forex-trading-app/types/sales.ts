// types/sales.ts
export interface SalesFXPrice {
  id: string;
  currencyPair: string;
  baseCurrency: string;
  quoteCurrency: string;
  bid: number;
  offer: number;
  spread: number;
  bidSpread: number;
  askSpread: number;
  timestamp: Date;
  source: string;
  marketHours: boolean;
}

export interface QuoteRequest {
  currencyPair: string;
  amount: number;
  direction: 'buy' | 'sell';
  userId?: string;
}

export interface QuoteResponse {
  quoteId: string;
  currencyPair: string;
  marketPrice: number;
  quotedPrice: number;
  spread: number;
  amount: number;
  equivalentAmount: number;
  direction: 'buy' | 'sell';
  expiresAt: Date;
  timestamp: Date;
}

export interface CapturedOperation {
  id: string;
  product: 'Spot';
  pair: string;
  amount: number;
  marketPrice: number;
  quotedPrice: number;
  equivalentAmount: number;
  status: 'Pendiente' | 'Completada' | 'Cancelada';
  userId: string;
  client: string;
  timestamp: string;
  type: 'buy' | 'sell';
  comments?: string;
}

export interface SalesQuotationSettings {
  defaultPairs: string[];
  maxQuoteTimeout: number; // seconds
  gridColumns: 4 | 6 | 8;
  autoRefreshInterval: number; // milliseconds
}

export interface SpreadConfig {
  currencyPair: string;
  bidSpread: number;
  askSpread: number;
  minAmount?: number;
  maxAmount?: number;
  isActive: boolean;
}

// Estados del hook de cotización
export interface UseSalesQuotationState {
  selectedPairs: string[];
  prices: Map<string, SalesFXPrice>;
  capturedOperations: CapturedOperation[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  quotationSettings: SalesQuotationSettings;
}

// Acciones del hook de cotización
export interface UseSalesQuotationActions {
  addPair: (pair: string) => void;
  removePair: (pair: string) => void;
  requestQuote: (request: QuoteRequest) => Promise<QuoteResponse>;
  captureOperation: (quote: QuoteResponse) => Promise<CapturedOperation>;
  updateSettings: (settings: Partial<SalesQuotationSettings>) => void;
  refreshPrices: () => Promise<void>;
}

export type UseSalesQuotationReturn = UseSalesQuotationState & UseSalesQuotationActions;