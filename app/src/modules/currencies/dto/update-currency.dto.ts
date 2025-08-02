import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  exchange_rate_to_usd?: number;
}
