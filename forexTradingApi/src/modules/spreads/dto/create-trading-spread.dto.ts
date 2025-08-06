// forexTradingApi/src/modules/spreads/dto/create-trading-spread.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTradingSpreadDto {
  @ApiProperty({
    description: 'Currency ID',
    example: 1,
  })
  @IsInt()
  currencyId: number;

  @ApiProperty({
    description: 'Market scenario ID',
    example: 1,
  })
  @IsInt()
  scenarioId: number;

  @ApiProperty({
    description: 'Minimum amount for this range',
    example: 0.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amountMin: number;

  @ApiProperty({
    description: 'Maximum amount for this range',
    example: 500000.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amountMax: number;

  @ApiProperty({
    description: 'Spread applied in this range',
    example: 0.0020,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(1)
  spread: number;
}
