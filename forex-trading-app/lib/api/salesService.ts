// lib/api/salesService.ts
import { authService } from './authService';
import type { 
  QuoteRequest, 
  QuoteResponse, 
  CapturedOperation, 
  SpreadConfig,
  SalesQuotationSettings 
} from '@/types/sales';

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

class SalesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  /**
   * Solicitar cotización de precio
   */
  async requestQuote(request: QuoteRequest): Promise<QuoteResponse> {
    try {
      const response = await authService.authenticatedRequest<QuoteResponse>(
        '/sales/quote',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      return {
        ...response,
        expiresAt: new Date(response.expiresAt),
        timestamp: new Date(response.timestamp)
      };
    } catch (error) {
      console.error('Error requesting quote:', error);
      throw error;
    }
  }

  /**
   * Capturar operación de cotización
   */
  async captureOperation(quoteId: string, comments?: string): Promise<CapturedOperation> {
    try {
      const response = await authService.authenticatedRequest<CapturedOperation>(
        '/sales/capture',
        {
          method: 'POST',
          body: JSON.stringify({ quoteId, comments }),
        }
      );

      return response;
    } catch (error) {
      console.error('Error capturing operation:', error);
      throw error;
    }
  }

  /**
   * Obtener operaciones capturadas del usuario
   */
  async getCapturedOperations(
    page: number = 1, 
    limit: number = 50,
    filters?: {
      dateFrom?: string;
      dateTo?: string;
      currencyPair?: string;
      status?: string;
    }
  ): Promise<{
    operations: CapturedOperation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const response = await authService.authenticatedRequest(
        `/sales/operations?${params.toString()}`
      );

      return response;
    } catch (error) {
      console.error('Error fetching captured operations:', error);
      throw error;
    }
  }

  /**
   * Obtener configuración de spreads para Sales
   */
  async getSpreadConfig(): Promise<SpreadConfig[]> {
    try {
      const response = await authService.authenticatedRequest<SpreadConfig[]>(
        '/sales/spread-config'
      );

      return response;
    } catch (error) {
      console.error('Error fetching spread config:', error);
      throw error;
    }
  }

  /**
   * Actualizar configuración de spreads
   */
  async updateSpreadConfig(config: SpreadConfig[]): Promise<void> {
    try {
      await authService.authenticatedRequest(
        '/sales/spread-config',
        {
          method: 'PUT',
          body: JSON.stringify(config),
        }
      );
    } catch (error) {
      console.error('Error updating spread config:', error);
      throw error;
    }
  }

  /**
   * Obtener configuración del módulo de cotización
   */
  async getQuotationSettings(): Promise<SalesQuotationSettings> {
    try {
      const response = await authService.authenticatedRequest<SalesQuotationSettings>(
        '/sales/quotation-settings'
      );

      return response;
    } catch (error) {
      console.error('Error fetching quotation settings:', error);
      // Retornar configuración por defecto si falla
      return {
        defaultPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCLP'],
        maxQuoteTimeout: 5,
        gridColumns: 4,
        autoRefreshInterval: 2000
      };
    }
  }

  /**
   * Actualizar configuración del módulo de cotización
   */
  async updateQuotationSettings(settings: Partial<SalesQuotationSettings>): Promise<void> {
    try {
      await authService.authenticatedRequest(
        '/sales/quotation-settings',
        {
          method: 'PUT',
          body: JSON.stringify(settings),
        }
      );
    } catch (error) {
      console.error('Error updating quotation settings:', error);
      throw error;
    }
  }

  /**
   * Cancelar una operación capturada
   */
  async cancelOperation(operationId: string, reason?: string): Promise<void> {
    try {
      await authService.authenticatedRequest(
        `/sales/operations/${operationId}/cancel`,
        {
          method: 'POST',
          body: JSON.stringify({ reason }),
        }
      );
    } catch (error) {
      console.error('Error canceling operation:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de cotización del usuario
   */
  async getQuotationStats(period: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalQuotes: number;
    capturedOperations: number;
    averageAmount: number;
    topCurrencyPairs: { pair: string; count: number }[];
    conversionRate: number;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/sales/stats?period=${period}`
      );

      return response;
    } catch (error) {
      console.error('Error fetching quotation stats:', error);
      throw error;
    }
  }

  /**
   * Validar si un par de divisa está disponible para cotización
   */
  async validateCurrencyPair(pair: string): Promise<{
    isValid: boolean;
    isAvailable: boolean;
    spreadConfig?: SpreadConfig;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/sales/validate-pair/${pair}`
      );

      return response;
    } catch (error) {
      console.error('Error validating currency pair:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de precios para análisis
   */
  async getPriceHistory(
    currencyPair: string, 
    period: '1h' | '4h' | '1d' = '1h',
    limit: number = 100
  ): Promise<{
    pair: string;
    prices: Array<{
      timestamp: Date;
      bid: number;
      offer: number;
      spread: number;
    }>;
  }> {
    try {
      const response = await authService.authenticatedRequest(
        `/sales/price-history/${currencyPair}?period=${period}&limit=${limit}`
      );

      return {
        ...response,
        prices: response.prices.map((price: any) => ({
          ...price,
          timestamp: new Date(price.timestamp)
        }))
      };
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const salesService = new SalesService();
export default salesService;