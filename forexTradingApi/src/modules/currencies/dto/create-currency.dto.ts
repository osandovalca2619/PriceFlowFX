// forexTradingApi/src/modules/currencies/dto/create-currency.dto.ts
import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, Length, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({ 
    description: 'Currency code (3 characters)', 
    example: 'USD',
    maxLength: 3,
    minLength: 3 
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Transform(({ value }) => value?.toUpperCase())
  code: string;

  @ApiProperty({ 
    description: 'Currency name', 
    example: 'US Dollar',
    maxLength: 50 
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

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
    default: 2,
    required: false 
  })
  @IsNumber()
  @IsOptional()
  decimals?: number = 2;

  @ApiProperty({ 
    description: 'Whether this is a strong currency', 
    example: true 
  })
  @IsBoolean()
  @IsNotEmpty()
  isStrongCurrency: boolean;

  @ApiProperty({ 
    description: 'ID of the user creating this currency', 
    example: 1 
  })
  @IsNumber()
  @IsNotEmpty()
  createdBy: number;

  @ApiProperty({ 
    description: 'Currency status', 
    example: 'activo',
    enum: ['activo', 'inactivo'],
    default: 'activo',
    required: false 
  })
  @IsString()
  @IsOptional()
  @IsIn(['activo', 'inactivo'])
  status?: string = 'activo';
}