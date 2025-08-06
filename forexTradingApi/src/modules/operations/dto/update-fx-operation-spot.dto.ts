// forexTradingApi/src/modules/operations/dto/update-fx-operation-spot.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateFxOperationSpotDto } from './create-fx-operation-spot.dto';
import { IsOptional, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFxOperationSpotDto extends PartialType(CreateFxOperationSpotDto) {
  @ApiPropertyOptional({
    description: 'Calculated PnL',
    example: 2000.00,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  pnlCalculated?: number;

  @ApiPropertyOptional({
    description: 'ID of user who modifies this record',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}