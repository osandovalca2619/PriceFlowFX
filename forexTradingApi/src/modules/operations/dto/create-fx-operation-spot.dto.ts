// forexTradingApi/src/modules/operations/dto/create-fx-operation-spot.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, IsDateString, IsOptional, IsEnum, Length } from 'class-validator';
import { Type } from 'class-transformer';
import { OperationSide } from '../entities/fx-operation-spot.entity';

export class CreateFxOperationSpotDto {
  @ApiProperty({
    description: 'Client who performs the operation',
    example: 1,
  })
  @IsInt()
  clientId: number;

  @ApiProperty({
    description: 'User who registers the operation',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Amount in currency 1',
    example: 100000.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amountCurrency1: number;

  @ApiProperty({
    description: 'Amount in currency 2',
    example: 108500.00,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  amountCurrency2: number;

  @ApiProperty({
    description: 'Cost price for the operation',
    example: 1.085000,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  costPrice: number;

  @ApiProperty({
    description: 'Margin applied to the operation',
    example: 0.0020,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  margin: number;

  @ApiProperty({
    description: 'Client price for the operation',
    example: 1.087000,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  clientPrice: number;

  @ApiProperty({
    description: 'Start date of the operation',
    example: '2024-01-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Value date of the operation',
    example: '2024-01-17',
  })
  @IsDateString()
  valueDate: string;

  @ApiPropertyOptional({
    description: 'Payment method for currency 1',
    example: 'WIRE_TRANSFER',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  paymentMethodCurrency1?: string;

  @ApiPropertyOptional({
    description: 'Payment method for currency 2',
    example: 'CASH',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  paymentMethodCurrency2?: string;

  @ApiProperty({
    description: 'Operation side',
    example: OperationSide.BUY,
    enum: OperationSide,
  })
  @IsEnum(OperationSide)
  operationSide: OperationSide;

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
    description: 'Origin of the quote',
    example: 1,
  })
  @IsInt()
  originId: number;

  @ApiProperty({
    description: 'Client segment ID',
    example: 1,
  })
  @IsInt()
  segmentId: number;

  @ApiPropertyOptional({
    description: 'Destination system ID',
    example: 123,
  })
  @IsOptional()
  @IsInt()
  destinationSystemId?: number;

  @ApiPropertyOptional({
    description: 'Source system ID',
    example: 456,
  })
  @IsOptional()
  @IsInt()
  sourceSystemId?: number;

  @ApiPropertyOptional({
    description: 'Operation comments',
    example: 'Special client operation',
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Trading folder ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  tradingFolderId?: number;

  @ApiPropertyOptional({
    description: 'Sales folder ID',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  salesFolderId?: number;

  @ApiPropertyOptional({
    description: 'Current workflow step',
    example: 'PENDING_APPROVAL',
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  workflowStep?: string;

  @ApiPropertyOptional({
    description: 'Operation status ID',
    example: 2,
    default: 2,
  })
  @IsOptional()
  @IsInt()
  statusId?: number = 2;

  // Este campo se asigna automáticamente en el controller
  createdBy: number;
}



