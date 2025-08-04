// src/modules/websocket/price.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriceWebSocketGateway } from './websocket.gateway';

interface FXPriceUpdate {
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

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);
  private readonly majorPairs = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
    'EURJPY', 'GBPJPY', 'EURGBP', 'EURAUD', 'EURCHF', 'AUDCAD', 'GBPAUD',
    'USDCLP', 'EURCLP', 'GBPCLP' // Agregamos pares con peso chileno
  ];

  private currentPrices: Map<string, FXPriceUpdate> = new Map();
  private priceHistory: Map<string, FXPriceUpdate[]> = new Map();

  constructor(private webSocketGateway: PriceWebSocketGateway) {
    // Inicializar precios base
    this.initializeBasePrices();
  }

  /**
   * Simular actualizaciones de precios cada 5 segundos
   */
  @Cron('*/5 * * * * *') // Cada 5 segundos
  handlePriceUpdates() {
    if (!this.isMarketOpen()) {
      return; // No actualizar precios fuera de horario
    }

    this.majorPairs.forEach(pair => {
      const newPrice = this.generatePriceUpdate(pair);
      this.currentPrices.set(pair, newPrice);
      
      // Guardar en historial
      this.addToHistory(pair, newPrice);
      
      // Broadcast a suscriptores
      this.webSocketGateway.broadcastPriceUpdate(newPrice);
    });

    this.logger.debug(`📊 Precios actualizados para ${this.majorPairs.length} pares`);
  }

  /**
   * Obtener precio actual de un par
   */
  getCurrentPrice(currencyPair: string): FXPriceUpdate | null {
    return this.currentPrices.get(currencyPair.toUpperCase()) || null;
  }

  /**
   * Obtener todos los precios actuales
   */
  getAllCurrentPrices(): FXPriceUpdate[] {
    return Array.from(this.currentPrices.values());
  }

  /**
   * Obtener historial de precios
   */
  getPriceHistory(
    currencyPair: string, 
    limit: number = 100
  ): FXPriceUpdate[] {
    const history = this.priceHistory.get(currencyPair.toUpperCase()) || [];
    return history.slice(-limit);
  }

  /**
   * Obtener pares disponibles
   */
  getAvailablePairs(): string[] {
    return [...this.majorPairs];
  }

  /**
   * Verificar si el mercado está abierto
   */
  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Mercado cerrado los fines de semana
    if (day === 0 || day === 6) return false;
    
    // Mercado abierto de 6 AM a 6 PM (simulado)
    return hour >= 6 && hour < 18;
  }

  /**
   * Obtener estado del mercado
   */
  getMarketStatus() {
    const isOpen = this.isMarketOpen();
    const now = new Date();
    
    return {
      isOpen,
      timezone: 'America/Santiago',
      currentTime: now,
      nextOpen: isOpen ? null : this.getNextMarketOpen(),
      nextClose: isOpen ? this.getNextMarketClose() : null,
    };
  }

  /**
   * Simular integración con proveedores externos de precios
   */
  async syncWithExternalProvider(provider: 'bloomberg' | 'reuters' | 'datatec') {
    this.logger.log(`🔄 Sincronizando precios con ${provider}...`);
    
    // Simular latencia de API externa
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular actualización de precios desde proveedor
    this.majorPairs.forEach(pair => {
      const externalPrice = this.generatePriceUpdate(pair, provider);
      this.currentPrices.set(pair, externalPrice);
      this.webSocketGateway.broadcastPriceUpdate(externalPrice);
    });

    this.logger.log(`✅ Precios sincronizados con ${provider}`);
  }

  private initializeBasePrices() {
    const basePrices = {
      EURUSD: 1.0850,
      GBPUSD: 1.2650,
      USDJPY: 148.50,
      USDCHF: 0.8750,
      AUDUSD: 0.6650,
      USDCAD: 1.3650,
      NZDUSD: 0.6150,
      EURJPY: 161.00,
      GBPJPY: 187.80,
      EURGBP: 0.8580,
      EURAUD: 1.6320,
      EURCHF: 0.9490,
      AUDCAD: 0.9080,
      GBPAUD: 1.9020,
      USDCLP: 950.00,
      EURCLP: 1030.75,
      GBPCLP: 1201.75,
    };

    Object.entries(basePrices).forEach(([pair, basePrice]) => {
      const priceUpdate = this.createPriceUpdate(pair, basePrice);
      this.currentPrices.set(pair, priceUpdate);
      this.priceHistory.set(pair, [priceUpdate]);
    });

    this.logger.log(`💰 Precios base inicializados para ${Object.keys(basePrices).length} pares`);
  }

  private generatePriceUpdate(
    currencyPair: string, 
    source: string = 'PriceFlowFX'
  ): FXPriceUpdate {
    const currentPrice = this.currentPrices.get(currencyPair);
    const basePrice = currentPrice ? currentPrice.mid : 1.0000;
    
    // Simular volatilidad (cambio de ±0.01% a ±0.05%)
    const volatility = 0.0005;
    const change = (Math.random() - 0.5) * 2 * volatility;
    const newMid = basePrice * (1 + change);
    
    return this.createPriceUpdate(currencyPair, newMid, source);
  }

  private createPriceUpdate(
    currencyPair: string, 
    midPrice: number, 
    source: string = 'PriceFlowFX'
  ): FXPriceUpdate {
    // Simular spread (0.5 a 2 pips dependiendo del par)
    const isExotic = currencyPair.includes('CLP');
    const spreadPips = isExotic ? 20 : (Math.random() * 1.5 + 0.5); // CLP tiene spreads más amplios
    const pipValue = currencyPair.includes('JPY') ? 0.01 : 0.0001;
    const spread = spreadPips * pipValue;

    const bid = midPrice - (spread / 2);
    const offer = midPrice + (spread / 2);

    return {
      id: `${currencyPair}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      currencyPair,
      baseCurrency: currencyPair.substring(0, 3),
      quoteCurrency: currencyPair.substring(3, 6),
      bid: parseFloat(bid.toFixed(currencyPair.includes('JPY') ? 3 : 5)),
      mid: parseFloat(midPrice.toFixed(currencyPair.includes('JPY') ? 3 : 5)),
      offer: parseFloat(offer.toFixed(currencyPair.includes('JPY') ? 3 : 5)),
      spread: parseFloat(spread.toFixed(currencyPair.includes('JPY') ? 3 : 5)),
      timestamp: new Date(),
      source,
      marketHours: this.isMarketOpen(),
    };
  }

  private addToHistory(currencyPair: string, price: FXPriceUpdate) {
    if (!this.priceHistory.has(currencyPair)) {
      this.priceHistory.set(currencyPair, []);
    }

    const history = this.priceHistory.get(currencyPair)!;
    history.push(price);

    // Mantener solo los últimos 1000 registros por par
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
  }

  private getNextMarketOpen(): Date {
    const now = new Date();
    const nextOpen = new Date(now);
    
    if (now.getDay() === 0) { // Domingo
      nextOpen.setDate(now.getDate() + 1); // Lunes
    } else if (now.getDay() === 6) { // Sábado
      nextOpen.setDate(now.getDate() + 2); // Lunes
    } else {
      nextOpen.setDate(now.getDate() + 1); // Día siguiente
    }
    
    nextOpen.setHours(6, 0, 0, 0);
    return nextOpen;
  }

  private getNextMarketClose(): Date {
    const now = new Date();
    const nextClose = new Date(now);
    nextClose.setHours(18, 0, 0, 0);
    
    if (nextClose <= now) {
      nextClose.setDate(now.getDate() + 1);
    }
    
    return nextClose;
  }
}