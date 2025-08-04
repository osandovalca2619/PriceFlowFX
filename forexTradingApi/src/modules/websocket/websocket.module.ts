// src/modules/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PriceWebSocketGateway } from './websocket.gateway';
import { AuthModule } from '../auth/auth.module';
import { PriceService } from './price.service';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    PriceWebSocketGateway,
    PriceService,
  ],
  exports: [PriceWebSocketGateway, PriceService],
})
export class WebSocketModule {}