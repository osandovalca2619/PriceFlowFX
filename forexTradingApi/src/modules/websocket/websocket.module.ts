// forexTradingApi/src/modules/websocket/websocket.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceWebSocketGateway } from './websocket.gateway';
import { PriceService } from './price.service';
import { Currency } from '../currencies/entities/currency.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Currency]),
    ScheduleModule.forRoot(),
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