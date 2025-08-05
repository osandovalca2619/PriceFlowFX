import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
interface AuthenticatedSocket extends Socket {
    userId?: number;
    username?: string;
}
export interface FXPriceUpdate {
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
export declare class PriceWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private readonly logger;
    private subscriptions;
    private clientSubscriptions;
    private connectedClients;
    private isGatewayInitialized;
    private pendingBroadcasts;
    constructor(jwtService: JwtService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSubscribePrice(client: AuthenticatedSocket, data: {
        currencyPair: string;
    }): Promise<void>;
    handleUnsubscribePrice(client: AuthenticatedSocket, data: {
        currencyPair: string;
    }): Promise<void>;
    handleGetSubscriptions(client: AuthenticatedSocket): void;
    handlePing(client: Socket): void;
    broadcastPriceUpdate(priceUpdate: FXPriceUpdate): void;
    isReadyForBroadcast(): boolean;
    getQueueStats(): {
        isInitialized: boolean;
        hasServer: boolean;
        pendingBroadcasts: number;
        connectedClients: number;
    };
    broadcastMarketStatus(status: any): void;
    broadcastError(message: string, details?: any): void;
    private addSubscription;
    private removeSubscription;
    private getConnectionStats;
}
export {};
