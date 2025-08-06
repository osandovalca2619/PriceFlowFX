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
var PriceWebSocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceWebSocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
let PriceWebSocketGateway = PriceWebSocketGateway_1 = class PriceWebSocketGateway {
    jwtService;
    server;
    logger = new common_1.Logger(PriceWebSocketGateway_1.name);
    subscriptions = new Map();
    clientSubscriptions = new Map();
    connectedClients = new Map();
    isGatewayInitialized = false;
    pendingBroadcasts = [];
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    afterInit(server) {
        this.logger.log('🚀 WebSocket Gateway initialized');
        this.isGatewayInitialized = true;
        if (this.pendingBroadcasts.length > 0) {
            this.logger.log(`📦 Processing ${this.pendingBroadcasts.length} pending broadcasts`);
            this.pendingBroadcasts.forEach(priceUpdate => {
                this.broadcastPriceUpdate(priceUpdate);
            });
            this.pendingBroadcasts = [];
        }
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                this.logger.warn(`🚫 Client ${client.id} connected without token`);
                client.emit('error', { message: 'Authentication required' });
                client.disconnect();
                return;
            }
            const payload = await this.jwtService.verifyAsync(token);
            const authenticatedClient = client;
            authenticatedClient.userId = payload.sub;
            authenticatedClient.username = payload.username;
            this.connectedClients.set(client.id, authenticatedClient);
            this.clientSubscriptions.set(client.id, new Set());
            this.logger.log(`✅ Client ${client.id} connected (User: ${payload.username})`);
            client.emit('connection_status', {
                status: 'connected',
                userId: payload.sub,
                username: payload.username,
                timestamp: new Date(),
                message: 'Successfully connected to PriceFlowFX WebSocket'
            });
            client.emit('server_stats', this.getConnectionStats());
        }
        catch (error) {
            this.logger.error(`❌ Authentication failed for client ${client.id}:`, error.message);
            client.emit('error', { message: 'Invalid token' });
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        const authenticatedClient = this.connectedClients.get(client.id);
        const username = authenticatedClient?.username || 'Unknown';
        const clientPairs = this.clientSubscriptions.get(client.id);
        if (clientPairs) {
            clientPairs.forEach(pair => {
                this.removeSubscription(client.id, pair);
            });
        }
        this.connectedClients.delete(client.id);
        this.clientSubscriptions.delete(client.id);
        this.logger.log(`👋 Client ${client.id} disconnected (User: ${username})`);
    }
    async handleSubscribePrice(client, data) {
        const { currencyPair } = data;
        if (!currencyPair) {
            client.emit('error', { message: 'Currency pair is required' });
            return;
        }
        const normalizedPair = currencyPair.toUpperCase().replace('/', '');
        try {
            const clientPairs = this.clientSubscriptions.get(client.id);
            if (clientPairs?.has(normalizedPair)) {
                client.emit('subscription_error', {
                    currencyPair: normalizedPair,
                    message: 'Already subscribed to this pair'
                });
                return;
            }
            this.addSubscription(client.id, client.userId, normalizedPair);
            await client.join(`pair_${normalizedPair}`);
            this.logger.log(`📈 Client ${client.id} subscribed to ${normalizedPair}`);
            client.emit('subscription_confirmed', {
                currencyPair: normalizedPair,
                message: `Successfully subscribed to ${normalizedPair}`,
                timestamp: new Date()
            });
            this.server.emit('server_stats', this.getConnectionStats());
        }
        catch (error) {
            this.logger.error(`Error subscribing client ${client.id} to ${normalizedPair}:`, error);
            client.emit('subscription_error', {
                currencyPair: normalizedPair,
                message: 'Failed to subscribe to currency pair',
                error: error.message
            });
        }
    }
    async handleUnsubscribePrice(client, data) {
        const { currencyPair } = data;
        const normalizedPair = currencyPair.toUpperCase().replace('/', '');
        try {
            this.removeSubscription(client.id, normalizedPair);
            await client.leave(`pair_${normalizedPair}`);
            this.logger.log(`📉 Client ${client.id} unsubscribed from ${normalizedPair}`);
            client.emit('unsubscribe_confirmed', {
                currencyPair: normalizedPair,
                message: `Successfully unsubscribed from ${normalizedPair}`,
                timestamp: new Date()
            });
            this.server.emit('server_stats', this.getConnectionStats());
        }
        catch (error) {
            this.logger.error(`Error unsubscribing client ${client.id} from ${normalizedPair}:`, error);
            client.emit('error', {
                message: 'Failed to unsubscribe from currency pair',
                error: error.message
            });
        }
    }
    handleGetSubscriptions(client) {
        const clientPairs = this.clientSubscriptions.get(client.id);
        const subscriptions = Array.from(clientPairs || []);
        client.emit('subscriptions_list', {
            subscriptions,
            count: subscriptions.length,
            timestamp: new Date()
        });
    }
    handlePing(client) {
        client.emit('pong', {
            timestamp: new Date(),
            latency: Date.now()
        });
    }
    broadcastPriceUpdate(priceUpdate) {
        if (!this.isGatewayInitialized || !this.server) {
            this.pendingBroadcasts.push(priceUpdate);
            if (this.pendingBroadcasts.length % 10 === 1) {
                this.logger.debug(`⏳ Gateway not ready, queueing broadcasts (${this.pendingBroadcasts.length} pending)`);
            }
            return;
        }
        try {
            const room = `pair_${priceUpdate.currencyPair}`;
            let subscriberCount = 0;
            if (this.server.sockets?.adapter?.rooms) {
                try {
                    subscriberCount = this.server.sockets.adapter.rooms.get(room)?.size || 0;
                }
                catch (adapterError) {
                    subscriberCount = 0;
                }
            }
            this.server.to(room).emit('price_update', {
                type: 'price_update',
                data: priceUpdate,
                timestamp: new Date()
            });
        }
        catch (error) {
            this.logger.error(`❌ Error broadcasting ${priceUpdate.currencyPair}:`, error.message);
        }
    }
    isReadyForBroadcast() {
        return this.isGatewayInitialized && !!this.server;
    }
    getQueueStats() {
        return {
            isInitialized: this.isGatewayInitialized,
            hasServer: !!this.server,
            pendingBroadcasts: this.pendingBroadcasts.length,
            connectedClients: this.connectedClients.size
        };
    }
    broadcastMarketStatus(status) {
        this.server.emit('market_status', {
            type: 'market_status',
            data: status,
            timestamp: new Date()
        });
    }
    broadcastError(message, details) {
        this.server.emit('server_error', {
            message,
            details,
            timestamp: new Date()
        });
    }
    addSubscription(socketId, userId, currencyPair) {
        if (!this.subscriptions.has(currencyPair)) {
            this.subscriptions.set(currencyPair, []);
        }
        const subscription = {
            socketId,
            userId,
            currencyPair,
            subscribedAt: new Date()
        };
        this.subscriptions.get(currencyPair).push(subscription);
        const clientPairs = this.clientSubscriptions.get(socketId);
        if (clientPairs) {
            clientPairs.add(currencyPair);
        }
    }
    removeSubscription(socketId, currencyPair) {
        const pairSubscriptions = this.subscriptions.get(currencyPair);
        if (pairSubscriptions) {
            const filtered = pairSubscriptions.filter(sub => sub.socketId !== socketId);
            if (filtered.length === 0) {
                this.subscriptions.delete(currencyPair);
            }
            else {
                this.subscriptions.set(currencyPair, filtered);
            }
        }
        const clientPairs = this.clientSubscriptions.get(socketId);
        if (clientPairs) {
            clientPairs.delete(currencyPair);
        }
    }
    getConnectionStats() {
        const totalConnections = this.connectedClients.size;
        const totalSubscriptions = Array.from(this.subscriptions.values())
            .reduce((sum, subs) => sum + subs.length, 0);
        const pairSubscriptionCounts = {};
        this.subscriptions.forEach((subs, pair) => {
            pairSubscriptionCounts[pair] = subs.length;
        });
        return {
            totalConnections,
            totalSubscriptions,
            pairSubscriptionCounts,
            timestamp: new Date()
        };
    }
};
exports.PriceWebSocketGateway = PriceWebSocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], PriceWebSocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe_price'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PriceWebSocketGateway.prototype, "handleSubscribePrice", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe_price'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PriceWebSocketGateway.prototype, "handleUnsubscribePrice", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_subscriptions'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PriceWebSocketGateway.prototype, "handleGetSubscriptions", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], PriceWebSocketGateway.prototype, "handlePing", null);
exports.PriceWebSocketGateway = PriceWebSocketGateway = PriceWebSocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
        namespace: '/prices',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], PriceWebSocketGateway);
//# sourceMappingURL=websocket.gateway.js.map