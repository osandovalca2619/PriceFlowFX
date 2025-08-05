// forexTradingApi/src/modules/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  username?: string;
}

interface PriceSubscription {
  socketId: string;
  userId: number;
  currencyPair: string;
  subscribedAt: Date;
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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/prices',
})
export class PriceWebSocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PriceWebSocketGateway.name);
  private subscriptions: Map<string, PriceSubscription[]> = new Map();
  private clientSubscriptions: Map<string, Set<string>> = new Map();
  private connectedClients: Map<string, AuthenticatedSocket> = new Map();
  private isGatewayInitialized = false;
  private pendingBroadcasts: FXPriceUpdate[] = [];

  constructor(private jwtService: JwtService) {}

    // Implementar OnGatewayInit
  afterInit(server: Server) {
    this.logger.log('🚀 WebSocket Gateway initialized');
    this.isGatewayInitialized = true;
    
    // Procesar broadcasts pendientes
    if (this.pendingBroadcasts.length > 0) {
      this.logger.log(`📦 Processing ${this.pendingBroadcasts.length} pending broadcasts`);
      this.pendingBroadcasts.forEach(priceUpdate => {
        this.broadcastPriceUpdate(priceUpdate);
      });
      this.pendingBroadcasts = [];
    }
  }

  async handleConnection(client: Socket) {
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
      const authenticatedClient = client as AuthenticatedSocket;
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

    } catch (error) {
      this.logger.error(`❌ Authentication failed for client ${client.id}:`, error.message);
      client.emit('error', { message: 'Invalid token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
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

  @SubscribeMessage('subscribe_price')
  async handleSubscribePrice(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { currencyPair: string }
  ) {
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

      this.addSubscription(client.id, client.userId!, normalizedPair);
      await client.join(`pair_${normalizedPair}`);

      this.logger.log(`📈 Client ${client.id} subscribed to ${normalizedPair}`);

      client.emit('subscription_confirmed', {
        currencyPair: normalizedPair,
        message: `Successfully subscribed to ${normalizedPair}`,
        timestamp: new Date()
      });

      this.server.emit('server_stats', this.getConnectionStats());

    } catch (error) {
      this.logger.error(`Error subscribing client ${client.id} to ${normalizedPair}:`, error);
      client.emit('subscription_error', {
        currencyPair: normalizedPair,
        message: 'Failed to subscribe to currency pair',
        error: error.message
      });
    }
  }

  @SubscribeMessage('unsubscribe_price')
  async handleUnsubscribePrice(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { currencyPair: string }
  ) {
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

    } catch (error) {
      this.logger.error(`Error unsubscribing client ${client.id} from ${normalizedPair}:`, error);
      client.emit('error', {
        message: 'Failed to unsubscribe from currency pair',
        error: error.message
      });
    }
  }

  @SubscribeMessage('get_subscriptions')
  handleGetSubscriptions(@ConnectedSocket() client: AuthenticatedSocket) {
    const clientPairs = this.clientSubscriptions.get(client.id);
    const subscriptions = Array.from(clientPairs || []);

    client.emit('subscriptions_list', {
      subscriptions,
      count: subscriptions.length,
      timestamp: new Date()
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { 
      timestamp: new Date(),
      latency: Date.now() 
    });
  }

   broadcastPriceUpdate(priceUpdate: FXPriceUpdate) {
    // Si el gateway no está inicializado, almacenar para después
    if (!this.isGatewayInitialized || !this.server) {
      this.pendingBroadcasts.push(priceUpdate);
      // Solo mostrar este log una vez cada 10 broadcasts pendientes para reducir spam
      if (this.pendingBroadcasts.length % 10 === 1) {
        this.logger.debug(`⏳ Gateway not ready, queueing broadcasts (${this.pendingBroadcasts.length} pending)`);
      }
      return;
    }

    try {
      const room = `pair_${priceUpdate.currencyPair}`;
      
      // Verificar adaptador de forma más robusta
      let subscriberCount = 0;
      if (this.server.sockets?.adapter?.rooms) {
        try {
          subscriberCount = this.server.sockets.adapter.rooms.get(room)?.size || 0;
        } catch (adapterError) {
          // Silenciar este error específico ya que no es crítico
          subscriberCount = 0;
        }
      }

      // Enviar actualización
      this.server.to(room).emit('price_update', {
        type: 'price_update',
        data: priceUpdate,
        timestamp: new Date()
      });

      // Log menos verboso
      if (subscriberCount > 0) {
        this.logger.debug(`📊 ${priceUpdate.currencyPair}: ${subscriberCount} subscribers`);
      }

    } catch (error) {
      this.logger.error(`❌ Error broadcasting ${priceUpdate.currencyPair}:`, error.message);
    }
  }

  // Método para verificar si está listo para broadcasts
  isReadyForBroadcast(): boolean {
    return this.isGatewayInitialized && !!this.server;
  }

  // Método para obtener estadísticas de la cola
  getQueueStats() {
    return {
      isInitialized: this.isGatewayInitialized,
      hasServer: !!this.server,
      pendingBroadcasts: this.pendingBroadcasts.length,
      connectedClients: this.connectedClients.size
    };
  }
  broadcastMarketStatus(status: any) {
    this.server.emit('market_status', {
      type: 'market_status',
      data: status,
      timestamp: new Date()
    });
  }

  broadcastError(message: string, details?: any) {
    this.server.emit('server_error', {
      message,
      details,
      timestamp: new Date()
    });
  }

  private addSubscription(socketId: string, userId: number, currencyPair: string) {
    if (!this.subscriptions.has(currencyPair)) {
      this.subscriptions.set(currencyPair, []);
    }

    const subscription: PriceSubscription = {
      socketId,
      userId,
      currencyPair,
      subscribedAt: new Date()
    };

    this.subscriptions.get(currencyPair)!.push(subscription);

    const clientPairs = this.clientSubscriptions.get(socketId);
    if (clientPairs) {
      clientPairs.add(currencyPair);
    }
  }

  private removeSubscription(socketId: string, currencyPair: string) {
    const pairSubscriptions = this.subscriptions.get(currencyPair);
    if (pairSubscriptions) {
      const filtered = pairSubscriptions.filter(sub => sub.socketId !== socketId);
      if (filtered.length === 0) {
        this.subscriptions.delete(currencyPair);
      } else {
        this.subscriptions.set(currencyPair, filtered);
      }
    }

    const clientPairs = this.clientSubscriptions.get(socketId);
    if (clientPairs) {
      clientPairs.delete(currencyPair);
    }
  }

  private getConnectionStats() {
    const totalConnections = this.connectedClients.size;
    const totalSubscriptions = Array.from(this.subscriptions.values())
      .reduce((sum, subs) => sum + subs.length, 0);
    
    const pairSubscriptionCounts: Record<string, number> = {};
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
}