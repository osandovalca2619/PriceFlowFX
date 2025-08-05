// forexTradingApi/src/modules/websocket/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      
      // Extraer token del handshake
      const token = client.handshake.auth?.token || 
                   client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn('No token provided in WebSocket connection');
        return false;
      }

      // Verificar JWT
      const payload = await this.jwtService.verifyAsync(token);
      
      // Agregar información del usuario al socket
      (client as any).userId = payload.sub;
      (client as any).username = payload.username;

      return true;
    } catch (error) {
      this.logger.error('WebSocket JWT verification failed:', error.message);
      return false;
    }
  }
}