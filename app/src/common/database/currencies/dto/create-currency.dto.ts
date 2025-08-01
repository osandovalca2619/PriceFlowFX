import {
  IsString,
  IsNotEmpty,
  Length,
  IsOptional,
  IsInt,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

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
  @IsNotEmpty()
  is_strong_currency: boolean;

  @IsNumber()
  @IsNotEmpty()
  created_by: number;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  status?: string;
}
