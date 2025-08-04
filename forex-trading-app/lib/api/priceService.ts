// lib/api/priceService.ts
import { authService } from './authService';

export interface FXPrice {
  id: string;
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
}

export interface PriceSubscription {
  currencyPair: string;
  callback: (price: FXPrice) => void;
}

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: Date;
  nextClose?: Date;
  timezone: string;
}

class PriceService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private isConnecting = false;
  private baseUrl: string;
  private wsUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  }

  /**
   * Conectar al WebSocket de precios
   */
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Conectar al WebSocket con autenticación
      this.ws = new WebSocket(`${this.wsUrl}/prices?token=${encodeURIComponent(token)}`);

      this.ws.onopen = () => {
        console.log('✅ Conectado al WebSocket de precios');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        
        // Reenviar todas las suscripciones existentes
        this.resubscribeAll();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlePriceUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket desconectado:', event.code, event.reason);
        this.isConnecting = false;
        this.ws = null;
        
        // Intentar reconectar si no fue cierre intencional
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
        this.isConnecting = false;
      };

    } catch (error) {
      console.error('Error conectando WebSocket:', error);
      this.isConnecting = false;
      throw error;
    }
  }

  /**
   * Desconectar WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Desconexión manual');
      this.ws = null;
    }
    this.subscriptions.clear();
  }

  /**
   * Suscribirse a actualizaciones de precios de un par de divisas
   */
  subscribe(currencyPair: string, callback: (price: FXPrice) => void): () => void {
    const subscription: PriceSubscription = { currencyPair, callback };
    
    if (!this.subscriptions.has(currencyPair)) {
      this.subscriptions.set(currencyPair, []);
    }
    
    this.subscriptions.get(currencyPair)!.push(subscription);

    // Enviar suscripción al servidor si está conectado
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(currencyPair);
    } else {
      // Conectar si no está conectado
      this.connect().catch(console.error);
    }

    // Retornar función de cleanup
    return () => {
      this.unsubscribe(currencyPair, callback);
    };
  }

  /**
   * Desuscribirse de actualizaciones de precios
   */
  unsubscribe(currencyPair: string, callback: (price: FXPrice) => void): void {
    const subs = this.subscriptions.get(currencyPair);
    if (subs) {
      const index = subs.findIndex(sub => sub.callback === callback);
      if (index !== -1) {
        subs.splice(index, 1);
        
        // Si no quedan suscripciones para este par, remover del servidor
        if (subs.length === 0) {
          this.subscriptions.delete(currencyPair);
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.sendUnsubscription(currencyPair);
          }
        }
      }
    }
  }

  /**
   * Obtener precio actual de un par de divisas (REST API)
   */
  async getCurrentPrice(currencyPair: string): Promise<FXPrice> {
    try {
      const response = await authService.authenticatedRequest<FXPrice>(
        `/api/prices/current/${currencyPair}`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo precio actual:', error);
      throw error;
    }
  }

  /**
   * Obtener precios históricos
   */
  async getHistoricalPrices(
    currencyPair: string,
    from: Date,
    to: Date,
    interval: '1m' | '5m' | '15m' | '1h' | '1d' = '1h'
  ): Promise<FXPrice[]> {
    try {
      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
        interval,
      });

      const response = await authService.authenticatedRequest<FXPrice[]>(
        `/api/prices/history/${currencyPair}?${params}`
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo precios históricos:', error);
      throw error;
    }
  }

  /**
   * Obtener estado del mercado
   */
  async getMarketStatus(): Promise<MarketStatus> {
    try {
      const response = await authService.authenticatedRequest<MarketStatus>(
        '/api/market/status'
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo estado del mercado:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de pares de divisas disponibles
   */
  async getAvailablePairs(): Promise<string[]> {
    try {
      const response = await authService.authenticatedRequest<string[]>(
        '/api/prices/pairs'
      );
      return response;
    } catch (error) {
      console.error('Error obteniendo pares disponibles:', error);
      throw error;
    }
  }

  private handlePriceUpdate(data: any): void {
    try {
      const price: FXPrice = {
        id: data.id,
        currencyPair: data.currencyPair,
        baseCurrency: data.baseCurrency,
        quoteCurrency: data.quoteCurrency,
        bid: parseFloat(data.bid),
        mid: parseFloat(data.mid),
        offer: parseFloat(data.offer),
        spread: parseFloat(data.spread || (data.offer - data.bid)),
        timestamp: new Date(data.timestamp),
        source: data.source || 'PriceFlowFX',
        marketHours: data.marketHours ?? true,
      };

      // Notificar a todos los suscriptores del par de divisas
      const subscribers = this.subscriptions.get(price.currencyPair);
      if (subscribers) {
        subscribers.forEach(sub => {
          try {
            sub.callback(price);
          } catch (error) {
            console.error('Error en callback de precio:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error procesando actualización de precio:', error);
    }
  }

  private sendSubscription(currencyPair: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        currencyPair,
      }));
    }
  }

  private sendUnsubscription(currencyPair: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        currencyPair,
      }));
    }
  }

  private resubscribeAll(): void {
    for (const currencyPair of this.subscriptions.keys()) {
      this.sendSubscription(currencyPair);
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }
}

// Exportar instancia singleton
export const priceService = new PriceService();
export default priceService;