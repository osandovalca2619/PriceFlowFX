// forexTradingApi/src/modules/spreads/dto/create-sales-spread.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesSpreadDto {
  @ApiProperty({
    description: 'Base currency ID',
    example: 1,
  })
  @IsInt()
  baseCurrencyId: number;

  @ApiProperty({
    description: 'Quote currency ID',
    example: 2,
  })
  @IsInt()
  quoteCurrencyId: number;

  @ApiProperty({
    description: 'Quote origin ID',
    example: 1,
  })
  @IsInt()
  originId: number;

  @ApiProperty({
    description: 'Segment ID',
    example: 1,
  })
  @IsInt()
  segmentId: number;

  @ApiProperty({
    description: 'FX Product ID',
    example: 1,
  })
  @IsInt()
  fxProductId: number;

  @ApiProperty({
    description: 'Whether this applies to market hours',
    example: true,
  })
  @IsBoolean()
  marketHours: boolean;

  @ApiProperty({
    description: 'Spread for buy operations',
    example: 0.0020,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  spreadBuy: number;

  @ApiProperty({
    description: 'Spread for sell operations',
    example: 0.0025,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  spreadSell: number;
}