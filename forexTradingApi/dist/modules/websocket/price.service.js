"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PriceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const websocket_gateway_1 = require("./websocket.gateway");
const currency_entity_1 = require("../currencies/entities/currency.entity");
let PriceService = PriceService_1 = class PriceService {
    currencyRepository;
    webSocketGateway;
    logger = new common_1.Logger(PriceService_1.name);
    currentPrices = new Map();
    priceHistory = new Map();
    availableCurrencies = [];
    availablePairs = [];
    isWebSocketReady = false;
    constructor(currencyRepository, webSocketGateway) {
        this.currencyRepository = currencyRepository;
        this.webSocketGateway = webSocketGateway;
        this.initializeService();
        setTimeout(() => {
            this.isWebSocketReady = true;
            this.logger.log('🔌 WebSocket ready flag set to true');
        }, 3000);
    }
    async initializeService() {
        try {
            await this.loadAvailableCurrencies();
            await this.generateCurrencyPairs();
            this.initializeBasePrices();
            this.logger.log(`🚀 PriceService initialized with ${this.availablePairs.length} currency pairs`);
        }
        catch (error) {
            this.logger.error('Failed to initialize PriceService:', error);
            this.initializeFallbackPairs();
        }
    }
    async loadAvailableCurrencies() {
        this.availableCurrencies = await this.currencyRepository.find({
            where: { status: 'activo' },
            order: { code: 'ASC' }
        });
        this.logger.log(`💰 Loaded ${this.availableCurrencies.length} active currencies`);
    }
    async generateCurrencyPairs() {
        const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CLP'];
        const activeCodes = this.availableCurrencies.map(c => c.code);
        const availableMajors = majorCurrencies.filter(code => activeCodes.includes(code));
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
    initializeFallbackPairs() {
        this.availablePairs = [
            'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
            'USDCNY', 'USDINR', 'USDBRL', 'USDMXN', 'USDCOP', 'CADCLP', 'CNYCLP',
            'USDCLP', 'EURCLP', 'GBPCLP'
        ];
        this.logger.log(`🔄 Using fallback currency pairs: ${this.availablePairs.length} pairs`);
        this.initializeBasePrices();
    }
    async validateCurrencyPair(currencyPair) {
        const normalizedPair = currencyPair.toUpperCase().replace('/', '');
        if (normalizedPair.length !== 6)
            return false;
        const baseCurrency = normalizedPair.substring(0, 3);
        const quoteCurrency = normalizedPair.substring(3, 6);
        if (this.availableCurrencies.length === 0) {
            const majorCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CLP'];
            return majorCurrencies.includes(baseCurrency) && majorCurrencies.includes(quoteCurrency);
        }
        const activeCodes = this.availableCurrencies.map(c => c.code);
        return activeCodes.includes(baseCurrency) && activeCodes.includes(quoteCurrency);
    }
    handlePriceUpdates() {
        try {
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
            let successCount = 0;
            let errorCount = 0;
            this.availablePairs.forEach((pair, index) => {
                try {
                    if (!pair || typeof pair !== 'string') {
                        this.logger.warn(`⚠️ Invalid currency pair at index ${index}:`, pair);
                        return;
                    }
                    const newPrice = this.generatePriceUpdate(pair);
                    if (newPrice) {
                        this.currentPrices.set(pair, newPrice);
                        this.addToHistory(pair, newPrice);
                        this.webSocketGateway.broadcastPriceUpdate(newPrice);
                        successCount++;
                    }
                }
                catch (pairError) {
                    errorCount++;
                    this.logger.error(`❌ Error processing pair ${pair}:`, pairError);
                }
            });
            if (successCount > 0) {
                const wsStats = this.webSocketGateway.getQueueStats();
                this.logger.debug(`📊 Prices: ${successCount}✅ ${errorCount}❌ | ` +
                    `WS: ${wsStats.isInitialized ? '🟢' : '🟡'} | ` +
                    `Clients: ${wsStats.connectedClients} | ` +
                    `Queue: ${wsStats.pendingBroadcasts}`);
            }
        }
        catch (error) {
            this.logger.error('❌ Fatal error in handlePriceUpdates:', error);
            if (this.availablePairs.length === 0) {
                this.logger.log('🔄 Attempting to reinitialize currency pairs...');
                this.initializeFallbackPairs();
            }
        }
    }
    logSystemStatus() {
        if (!this.isMarketOpen())
            return;
        const wsStats = this.webSocketGateway?.getQueueStats();
        if (wsStats && (wsStats.pendingBroadcasts > 0 || wsStats.connectedClients > 0)) {
            this.logger.log(`🏥 System Status: ` +
                `Pairs: ${this.availablePairs.length} | ` +
                `WS Ready: ${wsStats.isInitialized} | ` +
                `Clients: ${wsStats.connectedClients} | ` +
                `Pending: ${wsStats.pendingBroadcasts}`);
        }
    }
    getCurrentPrice(currencyPair) {
        return this.currentPrices.get(currencyPair.toUpperCase()) || null;
    }
    getAllCurrentPrices() {
        return Array.from(this.currentPrices.values());
    }
    getPriceHistory(currencyPair, limit = 100) {
        const history = this.priceHistory.get(currencyPair.toUpperCase()) || [];
        return history.slice(-limit);
    }
    getAvailablePairs() {
        return [...this.availablePairs];
    }
    getAvailableCurrencies() {
        return [...this.availableCurrencies];
    }
    isMarketOpen() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        if (day === 0 || day === 6)
            return false;
        return hour >= 0 && hour < 24;
    }
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
    async syncWithExternalProvider(provider) {
        this.logger.log(`🔄 Sincronizando precios con ${provider}...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.availablePairs.forEach(pair => {
            const externalPrice = this.generatePriceUpdate(pair, provider);
            this.currentPrices.set(pair, externalPrice);
            this.webSocketGateway.broadcastPriceUpdate(externalPrice);
        });
        this.logger.log(`✅ Precios sincronizados con ${provider}`);
    }
    initializeBasePrices() {
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
    generatePriceUpdate(currencyPair, source = 'PriceFlowFX') {
        const currentPrice = this.currentPrices.get(currencyPair);
        const basePrice = currentPrice ? currentPrice.mid : 1.0000;
        const volatility = 0.0005;
        const change = (Math.random() - 0.5) * 2 * volatility;
        const newMid = basePrice * (1 + change);
        return this.createPriceUpdate(currencyPair, newMid, source);
    }
    createPriceUpdate(currencyPair, midPrice, source = 'PriceFlowFX') {
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
    addToHistory(currencyPair, price) {
        if (!this.priceHistory.has(currencyPair)) {
            this.priceHistory.set(currencyPair, []);
        }
        const history = this.priceHistory.get(currencyPair);
        history.push(price);
        if (history.length > 1000) {
            history.splice(0, history.length - 1000);
        }
    }
    getNextMarketOpen() {
        const now = new Date();
        const nextOpen = new Date(now);
        if (now.getDay() === 0) {
            nextOpen.setDate(now.getDate() + 1);
        }
        else if (now.getDay() === 6) {
            nextOpen.setDate(now.getDate() + 2);
        }
        else {
            nextOpen.setDate(now.getDate() + 1);
        }
        nextOpen.setHours(0, 0, 0, 0);
        return nextOpen;
    }
    getNextMarketClose() {
        const now = new Date();
        const nextClose = new Date(now);
        nextClose.setHours(24, 0, 0, 0);
        if (nextClose <= now) {
            nextClose.setDate(now.getDate() + 1);
        }
        return nextClose;
    }
};
exports.PriceService = PriceService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceService.prototype, "handlePriceUpdates", null);
__decorate([
    (0, schedule_1.Cron)('*/30 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PriceService.prototype, "logSystemStatus", null);
exports.PriceService = PriceService = PriceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_entity_1.Currency)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        websocket_gateway_1.PriceWebSocketGateway])
], PriceService);
//# sourceMappingURL=price.service.js.map