// forexTradingApi/src/modules/websocket/price.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceWebSocketGateway, FXPriceUpdate } from './websocket.gateway';
import { Currency } from '../currencies/entities/currency.entity';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);
  private currentPrices: Map<string, FXPriceUpdate> = new Map();
  private priceHistory: Map<string, FXPriceUpdate[]> = new Map();
  private availableCurrencies: Currency[] = [];
  private availablePairs: string[] = [];
  private isWebSocketReady = false;

  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private webSocketGateway: PriceWebSocketGateway
  ) {
    this.initializeService();
    // Dar tiempo al WebSocket para inicializarse
    setTimeout(() => {
      this.isWebSocketReady = true;
      this.logger.log('🔌 WebSocket ready flag set to true');
    }, 3000); // 3 segundos de delay
  }

  /**
   * Inicializar el servicio cargando las divisas desde la base de datos
   */
  private async initializeService() {
    try {
      await this.loadAvailableCurrencies();
      await this.generateCurrencyPairs();
      this.initializeBasePrices();
      this.logger.log(`🚀 PriceService initialized with ${this.availablePairs.length} currency pairs`);
    } catch (error) {
      this.logger.error('Failed to initialize PriceService:', error);
      // Fallback to default pairs if database is not available
      this.initializeFallbackPairs();
    }
  }

  /**
   * Cargar divisas activas desde la base de datos
   */
  async loadAvailableCurrencies(): Promise<void> {
    this.availableCurrencies = await this.currencyRepository.find({
      where: { status: 'activo' },
      order: { code: 'ASC' }
    });
    this.logger.log(`💰 Loaded ${this.availableCurrencies.length} active currencies`);
  }

  /**
   * Generar pares de divisas basándose en las divisas activas
   */
  private async generateCurrencyPairs(): Promise<void> {
    const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CLP'];
    const activeCodes = this.availableCurrencies.map(c => c.code);
    
    // Filtrar solo las divisas principales que están activas
    const availableMajors = majorCurrencies.filter(code => activeCodes.includes(code));
    
    // Generar pares principales
    this.availablePairs = [];
    
    for (let i = 0; i < availableMajors.length; i++) {
      for (let j = 0; j < availableMajors.length; j++) {
        if (i !== j) {
          const pair = `${availableMajors[i]}${availableMajors[j]}`;
          this.availablePairs.push(pair);
        }
      }
    }

    this.logger.log(`📊 Generated ${this.availablePairs.length} currency pairs`);
  }

  /**
   * Pares de fallback si no hay base de datos disponible
   */
  private initializeFallbackPairs() {
    this.availablePairs = [
      'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
      'USDCNY', 'USDINR', 'USDBRL', 'USDMXN', 'USDCOP', 'CADCLP', 'CNYCLP',
      'USDCLP', 'EURCLP', 'GBPCLP'
    ];
    this.logger.log(`🔄 Using fallback currency pairs: ${this.availablePairs.length} pairs`);
    this.initializeBasePrices();
  }

  /**
   * Validar si un par de divisas es válido
   */
  async validateCurrencyPair(currencyPair: string): Promise<boolean> {
    const normalizedPair = currencyPair.toUpperCase().replace('/', '');
    
    if (normalizedPair.length !== 6) return false;
    
    const baseCurrency = normalizedPair.substring(0, 3);
    const quoteCurrency = normalizedPair.substring(3, 6);
    
    if (this.availableCurrencies.length === 0) {
      // Fallback validation
      const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CLP'];
      return majorCurrencies.includes(baseCurrency) && majorCurrencies.includes(quoteCurrency);
    }
    
    const activeCodes = this.availableCurrencies.map(c => c.code);
    return activeCodes.includes(baseCurrency) && activeCodes.includes(quoteCurrency);
  }

  
/**
 * Simular actualizaciones de precios cada 5 segundos
 */
@Cron('*/5 * * * * *')
handlePriceUpdates() {
  try {
    // Verificaciones de seguridad
    if (!this.isMarketOpen()) {
      this.logger.debug('📴 Market is closed, skipping price updates');
      return;
    }

    if (!this.availablePairs || this.availablePairs.length === 0) {
      this.logger.warn('⚠️ No available currency pairs found');
      return;
    }

    if (!this.webSocketGateway) {
      this.logger.error('❌ WebSocket gateway not initialized');
      return;
    }

    // Procesar actualizaciones
    let successCount = 0;
    let errorCount = 0;

    this.availablePairs.forEach((pair, index) => {
      try {
        // Verificar que el par sea válido
        if (!pair || typeof pair !== 'string') {
          this.logger.warn(`⚠️ Invalid currency pair at index ${index}:`, pair);
          return;
        }

        const newPrice = this.generatePriceUpdate(pair);
        
        if (newPrice) {
          // Actualizar precios localmente (esto siempre funciona)
          this.currentPrices.set(pair, newPrice);
          this.addToHistory(pair, newPrice);
          
          // Enviar via WebSocket (se maneja internamente si no está listo)
          this.webSocketGateway.broadcastPriceUpdate(newPrice);
          successCount++;
        }
      } catch (pairError) {
        errorCount++;
        this.logger.error(`❌ Error processing pair ${pair}:`, pairError);
      }
    });

    // Log menos frecuente y más informativo
    if (successCount > 0) {
      const wsStats = this.webSocketGateway.getQueueStats();
      this.logger.debug(
        `📊 Prices: ${successCount}✅ ${errorCount}❌ | ` +
        `WS: ${wsStats.isInitialized ? '🟢' : '🟡'} | ` +
        `Clients: ${wsStats.connectedClients} | ` +
        `Queue: ${wsStats.pendingBroadcasts}`
      );
    }

  } catch (error) {
    this.logger.error('❌ Fatal error in handlePriceUpdates:', error);
    
    // Intentar reinicializar si es crítico
    if (this.availablePairs.length === 0) {
      this.logger.log('🔄 Attempting to reinitialize currency pairs...');
      this.initializeFallbackPairs();
    }
  }
}

// Agregar este método para diagnóstico
@Cron('*/30 * * * * *') // Cada 30 segundos
logSystemStatus() {
  if (!this.isMarketOpen()) return;
  
  const wsStats = this.webSocketGateway?.getQueueStats();
  if (wsStats && (wsStats.pendingBroadcasts > 0 || wsStats.connectedClients > 0)) {
    this.logger.log(
      `🏥 System Status: ` +
      `Pairs: ${this.availablePairs.length} | ` +
      `WS Ready: ${wsStats.isInitialized} | ` +
      `Clients: ${wsStats.connectedClients} | ` +
      `Pending: ${wsStats.pendingBroadcasts}`
    );
  }
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
  getPriceHistory(currencyPair: string, limit: number = 100): FXPriceUpdate[] {
    const history = this.priceHistory.get(currencyPair.toUpperCase()) || [];
    return history.slice(-limit);
  }

  /**
   * Obtener pares disponibles
   */
  getAvailablePairs(): string[] {
    return [...this.availablePairs];
  }

  /**
   * Obtener divisas disponibles
   */
  getAvailableCurrencies(): Currency[] {
    return [...this.availableCurrencies];
  }

  /**
   * Verificar si el mercado está abierto
   */
  isMarketOpen(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    if (day === 0 || day === 6) return false;
    return hour >= 0 && hour < 24;
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
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.availablePairs.forEach(pair => {
      const externalPrice = this.generatePriceUpdate(pair, provider);
      this.currentPrices.set(pair, externalPrice);
      this.webSocketGateway.broadcastPriceUpdate(externalPrice);
    });

    this.logger.log(`✅ Precios sincronizados con ${provider}`);
  }

  private initializeBasePrices() {
    const basePrices = {
      EURUSD: 1.0850, GBPUSD: 1.2650, USDJPY: 148.50, USDCHF: 0.8750,
      AUDUSD: 0.6650, USDCAD: 1.3650, NZDUSD: 0.6150, EURJPY: 161.00,
      GBPJPY: 187.80, EURGBP: 0.8580, EURAUD: 1.6320, EURCHF: 0.9490,
      AUDCAD: 0.9080, GBPAUD: 1.9020, USDCLP: 950.00, EURCLP: 1030.75,
      GBPCLP: 1201.75,
    };

    Object.entries(basePrices).forEach(([pair, basePrice]) => {
      if (this.availablePairs.includes(pair)) {
        const priceUpdate = this.createPriceUpdate(pair, basePrice);
        this.currentPrices.set(pair, priceUpdate);
        this.priceHistory.set(pair, [priceUpdate]);
      }
    });

    this.logger.log(`💰 Precios base inicializados para ${this.currentPrices.size} pares`);
  }

  private generatePriceUpdate(currencyPair: string, source: string = 'PriceFlowFX'): FXPriceUpdate {
    const currentPrice = this.currentPrices.get(currencyPair);
    const basePrice = currentPrice ? currentPrice.mid : 1.0000;
    
    const volatility = 0.0005;
    const change = (Math.random() - 0.5) * 2 * volatility;
    const newMid = basePrice * (1 + change);
    
    return this.createPriceUpdate(currencyPair, newMid, source);
  }

  private createPriceUpdate(currencyPair: string, midPrice: number, source: string = 'PriceFlowFX'): FXPriceUpdate {
    const isExotic = currencyPair.includes('CLP');
    const spreadPips = isExotic ? 20 : (Math.random() * 1.5 + 0.5);
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

    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }
  }

  private getNextMarketOpen(): Date {
    const now = new Date();
    const nextOpen = new Date(now);
    
    if (now.getDay() === 0) {
      nextOpen.setDate(now.getDate() + 1);
    } else if (now.getDay() === 6) {
      nextOpen.setDate(now.getDate() + 2);
    } else {
      nextOpen.setDate(now.getDate() + 1);
    }
    
    nextOpen.setHours(0, 0, 0, 0);
    return nextOpen;
  }

  private getNextMarketClose(): Date {
    const now = new Date();
    const nextClose = new Date(now);
    nextClose.setHours(24, 0, 0, 0);
    
    if (nextClose <= now) {
      nextClose.setDate(now.getDate() + 1);
    }
    
    return nextClose;
  }
}