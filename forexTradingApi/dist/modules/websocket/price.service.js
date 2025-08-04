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
var PriceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const websocket_gateway_1 = require("./websocket.gateway");
let PriceService = PriceService_1 = class PriceService {
    webSocketGateway;
    logger = new common_1.Logger(PriceService_1.name);
    majorPairs = [
        'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
        'EURJPY', 'GBPJPY', 'EURGBP', 'EURAUD', 'EURCHF', 'AUDCAD', 'GBPAUD',
        'USDCLP', 'EURCLP', 'GBPCLP'
    ];
    currentPrices = new Map();
    priceHistory = new Map();
    constructor(webSocketGateway) {
        this.webSocketGateway = webSocketGateway;
        this.initializeBasePrices();
    }
    handlePriceUpdates() {
        if (!this.isMarketOpen()) {
            return;
        }
        this.majorPairs.forEach(pair => {
            const newPrice = this.generatePriceUpdate(pair);
            this.currentPrices.set(pair, newPrice);
            this.addToHistory(pair, newPrice);
            this.webSocketGateway.broadcastPriceUpdate(newPrice);
        });
        this.logger.debug(`📊 Precios actualizados para ${this.majorPairs.length} pares`);
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
        return [...this.majorPairs];
    }
    isMarketOpen() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        if (day === 0 || day === 6)
            return false;
        return hour >= 6 && hour < 18;
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
        this.majorPairs.forEach(pair => {
            const externalPrice = this.generatePriceUpdate(pair, provider);
            this.currentPrices.set(pair, externalPrice);
            this.webSocketGateway.broadcastPriceUpdate(externalPrice);
        });
        this.logger.log(`✅ Precios sincronizados con ${provider}`);
    }
    initializeBasePrices() {
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
        nextOpen.setHours(6, 0, 0, 0);
        return nextOpen;
    }
    getNextMarketClose() {
        const now = new Date();
        const nextClose = new Date(now);
        nextClose.setHours(18, 0, 0, 0);
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
exports.PriceService = PriceService = PriceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [websocket_gateway_1.PriceWebSocketGateway])
], PriceService);
//# sourceMappingURL=price.service.js.map