// forexTradingApi/src/modules/spreads/spreads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpreadsService } from './spreads.service';
import { SpreadsController } from './spreads.controller';
import { TradingSpreadRange } from './entities/trading-spread-range.entity';
import { SalesSpread } from './entities/sales-spread.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradingSpreadRange,
      SalesSpread,
    ]),
  ],
  controllers: [SpreadsController],
  providers: [SpreadsService],
  exports: [SpreadsService, TypeOrmModule],
})
export class SpreadsModule {}