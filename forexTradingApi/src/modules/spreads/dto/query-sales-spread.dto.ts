// forexTradingApi/src/modules/spreads/dto/query-sales-spread.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QuerySalesSpreadDto {
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
    description: 'Filter by FX product ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fxProductId?: number;

  @ApiPropertyOptional({
    description: 'Filter by market hours',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  marketHours?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by currency pair (format: USD/CLP)',
    example: 'USD/CLP',
  })
  @IsOptional()
  @IsString()
  currencyPair?: string;
}