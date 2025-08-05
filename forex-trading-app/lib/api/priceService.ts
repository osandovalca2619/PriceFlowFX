// forex-trading-app/lib/api/priceService.ts
import { io, Socket } from 'socket.io-client';

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

interface PriceSubscription {
  currencyPair: string;
  callback: (price: FXPrice) => void;
  id: string;
}

interface ServerStats {
  totalConnections: number;
  totalSubscriptions: number;
  pairSubscriptionCounts: Record<string, number>;
  timestamp: Date;
}

interface ConnectionStatus {
  status: string;
  userId?: number;
  username?: string;
  timestamp: Date;
  message: string;
}

class PriceService {
  private socket: Socket | null = null;
  private subscriptions = new Map<string, PriceSubscription[]>();
  private isConnecting = false;
  private wsUrl: string;
  private authToken: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event listeners
  private onConnectionChange: ((connected: boolean) => void)[] = [];
  private onServerStats: ((stats: ServerStats) => void)[] = [];
  private onError: ((error: any) => void)[] = [];

  constructor(wsUrl: string = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000') {
    this.wsUrl = wsUrl;
  }

  /**
   * Establecer token de autenticación
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Conectar al WebSocket
   */
  async connect(): Promise<void> {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve();
          } else if (!this.isConnecting) {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      });
    }

    return new Promise((resolve, reject) => {
      try {
        this.isConnecting = true;

        if (!this.authToken) {
          throw new Error('Authentication token required');
        }

        this.socket = io(`${this.wsUrl}/prices`, {
          auth: {
            token: this.authToken
          },
          transports: ['websocket'],
          timeout: 10000,
        });

        this.setupEventListeners();

        this.socket.on('connect', () => {
          console.log('✅ Connected to PriceFlowFX WebSocket');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.notifyConnectionChange(true);
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error);
          this.isConnecting = false;
          this.notifyError(error);
          reject(error);
        });

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Configurar event listeners del socket
   */
  private setupEventListeners() {
    if (!this.socket) return;

    // Eventos de conexión
    this.socket.on('connection_status', (data: ConnectionStatus) => {
      console.log('📡 Connection status:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('👋 Disconnected from WebSocket:', reason);
      this.notifyConnectionChange(false);
      
      if (reason === 'io server disconnect') {
        // Reconexión manual requerida
        this.scheduleReconnect();
      }
    });

    // Eventos de precios
    this.socket.on('price_update', (data) => {
      this.handlePriceUpdate(data);
    });

    this.socket.on('subscription_confirmed', (data) => {
      console.log('✅ Subscription confirmed:', data);
    });

    this.socket.on('subscription_error', (data) => {
      console.error('❌ Subscription error:', data);
      this.notifyError(data);
    });

    this.socket.on('unsubscribe_confirmed', (data) => {
      console.log('✅ Unsubscribe confirmed:', data);
    });

    // Eventos del servidor
    this.socket.on('server_stats', (data: ServerStats) => {
      this.notifyServerStats(data);
    });

    this.socket.on('market_status', (data) => {
      console.log('📊 Market status update:', data);
    });

    this.socket.on('server_error', (data) => {
      console.error('🚨 Server error:', data);
      this.notifyError(data);
    });

    this.socket.on('error', (data) => {
      console.error('❌ Socket error:', data);
      this.notifyError(data);
    });

    // Pong para keepalive
    this.socket.on('pong', (data) => {
      console.debug('🏓 Pong received:', data);
    });
  }

  /**
   * Manejar actualizaciones de precios
   */
  private handlePriceUpdate(data: { type: string; data: FXPrice; timestamp: Date }) {
    const { data: priceData } = data;
    const { currencyPair } = priceData;

    // Notificar a todos los suscriptores de este par
    const subscribers = this.subscriptions.get(currencyPair) || [];
    subscribers.forEach(subscription => {
      try {
        subscription.callback(priceData);
      } catch (error) {
        console.error('Error in price callback:', error);
      }
    });
  }

  /**
   * Suscribirse a actualizaciones de precios
   */
  async subscribe(
    currencyPair: string,
    callback: (price: FXPrice) => void
  ): Promise<() => void> {
    // Conectar si no está conectado
    await this.connect();

    const subscriptionId = this.generateSubscriptionId();
    const subscription: PriceSubscription = {
      currencyPair,
      callback,
      id: subscriptionId
    };

    // Agregar a la lista de suscripciones
    if (!this.subscriptions.has(currencyPair)) {
      this.subscriptions.set(currencyPair, []);
      // Enviar suscripción al servidor solo si es el primer suscriptor
      this.socket?.emit('subscribe_price', { currencyPair });
    }

    this.subscriptions.get(currencyPair)!.push(subscription);

    // Retornar función de desuscripción
    return () => {
      this.unsubscribe(currencyPair, subscriptionId);
    };
  }

  /**
   * Desuscribirse de un par específico
   */
  private unsubscribe(currencyPair: string, subscriptionId: string) {
    const subscribers = this.subscriptions.get(currencyPair);
    if (!subscribers) return;

    // Eliminar la suscripción específica
    const filteredSubscribers = subscribers.filter(sub => sub.id !== subscriptionId);
    
    if (filteredSubscribers.length === 0) {
      // Si no quedan suscriptores, eliminar del mapa y desuscribir del servidor
      this.subscriptions.delete(currencyPair);
      this.socket?.emit('unsubscribe_price', { currencyPair });
    } else {
      // Actualizar la lista de suscriptores
      this.subscriptions.set(currencyPair, filteredSubscribers);
    }
  }

  /**
   * Obtener precio actual (no implementado en tiempo real, usar suscripción)
   */
  async getCurrentPrice(currencyPair: string): Promise<FXPrice> {
    return new Promise((resolve, reject) => {
      // Para obtener precio actual, necesitaríamos implementar un endpoint REST
      // o usar el último precio recibido via WebSocket
      reject(new Error('getCurrentPrice not implemented - use subscribe instead'));
    });
  }

  /**
   * Desconectar del WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.subscriptions.clear();
    this.notifyConnectionChange(false);
  }

  /**
   * Verificar estado de conexión
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Obtener estado de conexión
   */
  getConnectionStatus(): string {
    if (!this.socket) return 'disconnected';
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  /**
   * Enviar ping al servidor
   */
  ping() {
    this.socket?.emit('ping');
  }

  /**
   * Obtener suscripciones actuales
   */
  getSubscriptions() {
    this.socket?.emit('get_subscriptions');
  }

  // Event listener methods
  onConnection(callback: (connected: boolean) => void) {
    this.onConnectionChange.push(callback);
  }

  onStats(callback: (stats: ServerStats) => void) {
    this.onServerStats.push(callback);
  }

  onErrorEvent(callback: (error: any) => void) {
    this.onError.push(callback);
  }

  // Private helper methods
  private generateSubscriptionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private notifyConnectionChange(connected: boolean) {
    this.onConnectionChange.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection callback:', error);
      }
    });
  }

  private notifyServerStats(stats: ServerStats) {
    this.onServerStats.forEach(callback => {
      try {
        callback(stats);
      } catch (error) {
        console.error('Error in stats callback:', error);
      }
    });
  }

  private notifyError(error: any) {
    this.onError.forEach(callback => {
      try {
        callback(error);
      } catch (error) {
        console.error('Error in error callback:', error);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }
}

// Instancia singleton del servicio
export const priceService = new PriceService();