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
export declare class PriceService {
    private webSocketGateway;
    private readonly logger;
    private readonly majorPairs;
    private currentPrices;
    private priceHistory;
    constructor(webSocketGateway: PriceWebSocketGateway);
    handlePriceUpdates(): void;
    getCurrentPrice(currencyPair: string): FXPriceUpdate | null;
    getAllCurrentPrices(): FXPriceUpdate[];
    getPriceHistory(currencyPair: string, limit?: number): FXPriceUpdate[];
    getAvailablePairs(): string[];
    isMarketOpen(): boolean;
    getMarketStatus(): {
        isOpen: boolean;
        timezone: string;
        currentTime: Date;
        nextOpen: Date | null;
        nextClose: Date | null;
    };
    syncWithExternalProvider(provider: 'bloomberg' | 'reuters' | 'datatec'): Promise<void>;
    private initializeBasePrices;
    private generatePriceUpdate;
    private createPriceUpdate;
    private addToHistory;
    private getNextMarketOpen;
    private getNextMarketClose;
}
export {};
