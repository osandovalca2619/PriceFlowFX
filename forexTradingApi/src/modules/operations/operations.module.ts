// forexTradingApi/src/modules/operations/operations.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxOperationsService } from './fx-operations.service';
import { FxOperationsController } from './fx-operations.controller';
import { FxOperationSpot } from './entities/fx-operation-spot.entity';
import { FxOperationStatus } from './entities/fx-operation-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FxOperationSpot,
      FxOperationStatus,
    ]),
  ],
  controllers: [FxOperationsController],
  providers: [FxOperationsService],
  exports: [FxOperationsService, TypeOrmModule],
})
export class OperationsModule {}