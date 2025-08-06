// forexTradingApi/src/modules/spreads/dto/query-trading-spread.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTradingSpreadDto {
  @ApiPropertyOptional({
    description: 'Filter by currency ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  currencyId?: number;

  @ApiPropertyOptional({
    description: 'Filter by scenario ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  scenarioId?: number;

  @ApiPropertyOptional({
    description: 'Filter by currency code',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({
    description: 'Filter by scenario code',
    example: 'NORMAL',
  })
  @IsOptional()
  @IsString()
  scenarioCode?: string;
}