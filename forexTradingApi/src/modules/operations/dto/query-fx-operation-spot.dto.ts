// forexTradingApi/src/modules/operations/dto/query-fx-operation-spot.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OperationSide } from '../entities/fx-operation-spot.entity';

export class QueryFxOperationSpotDto {
  @ApiPropertyOptional({
    description: 'Filter by client ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional({
    description: 'Filter by base currency ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  baseCurrencyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by quote currency ID',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  quoteCurrencyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by operation side',
    example: OperationSide.BUY,
    enum: OperationSide,
  })
  @IsOptional()
  @IsEnum(OperationSide)
  operationSide?: OperationSide;

  @ApiPropertyOptional({
    description: 'Filter by status ID',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  statusId?: number;

  @ApiPropertyOptional({
    description: 'Filter from start date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter to start date',
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by origin ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  originId?: number;

  @ApiPropertyOptional({
    description: 'Filter by segment ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  segmentId?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;
}