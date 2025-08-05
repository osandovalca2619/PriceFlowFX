// forexTradingApi/src/modules/currencies/dto/update-currency.dto.ts
import { IsString, IsOptional, IsBoolean, IsNumber, Length, IsIn, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCurrencyDto {
  @ApiProperty({ 
    description: 'Currency code (3 characters)', 
    example: 'USD',
    maxLength: 3,
    minLength: 3,
    required: false 
  })
  @IsString()
  @IsOptional()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Transform(({ value }) => value?.toUpperCase())
  code?: string;

  @ApiProperty({ 
    description: 'Currency name', 
    example: 'US Dollar',
    maxLength: 50,
    required: false 
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  name?: string;

  @ApiProperty({ 
    description: 'Currency symbol', 
    example: '$',
    maxLength: 5,
    required: false 
  })
  @IsString()
  @IsOptional()
  @Length(1, 5)
  symbol?: string;

  @ApiProperty({ 
    description: 'Country name', 
    example: 'United States',
    maxLength: 50,
    required: false 
  })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  country?: string;

  @ApiProperty({ 
    description: 'Number of decimal places', 
    example: 2,
    required: false 
  })
  @IsNumber()
  @IsOptional()
  decimals?: number;

  @ApiProperty({ 
    description: 'Whether this is a strong currency', 
    example: true,
    required: false 
  })
  @IsBoolean()
  @IsOptional()
  isStrongCurrency?: boolean;

  @ApiProperty({ 
    description: 'ID of the user modifying this currency', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  modifiedBy: number;

  @ApiProperty({ 
    description: 'Currency status', 
    example: 'activo',
    enum: ['activo', 'inactivo'],
    required: false 
  })
  @IsString()
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  status?: string;
}