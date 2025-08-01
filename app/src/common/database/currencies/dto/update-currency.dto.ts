import {
  IsString,
  IsOptional,
  Length,
  IsInt,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsOptional()
  @Length(3, 3)
  code?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 5)
  symbol?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  country?: string;

  @IsInt()
  @IsOptional()
  decimals?: number;

  @IsBoolean()
  @IsOptional()
  is_strong_currency?: boolean;

  @IsNumber()
  @IsNotEmpty()
  modified_by: number;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  status?: string;
}
