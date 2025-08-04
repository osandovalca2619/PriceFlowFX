// src/modules/websocket/websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
}

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Agregar tu frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/prices', // Namespace específico para precios
})
export class PriceWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PriceWebSocketGateway.name);
  private subscriptions: