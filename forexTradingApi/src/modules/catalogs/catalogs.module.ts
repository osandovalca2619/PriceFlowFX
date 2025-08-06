// forexTradingApi/src/modules/catalogs/catalogs.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { Segment } from './entities/segment.entity';
import { QuoteOrigin } from './entities/quote-origin.entity';
import { FxProduct } from './entities/fx-product.entity';
import { MarketScenario } from './entities/market-scenario.entity';
import { FxOperationStatus } from '../operations/entities/fx-operation-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Segment,
      QuoteOrigin,
      FxProduct,
      MarketScenario,
      FxOperationStatus,
    ]),
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}