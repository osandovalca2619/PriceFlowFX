// forexTradingApi/src/modules/clients/dto/create-client.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsInt } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'Client internal identifier',
    example: 'CLI001234',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  clientIdentifier: string;

  @ApiProperty({
    description: 'Client full name',
    example: 'Juan Pérez González',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Client segment ID',
    example: 1,
  })
  @IsInt()
  segmentId: number;

  @ApiPropertyOptional({
    description: 'Client status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  @IsOptional()
  @IsString()
  status?: string = 'activo';

  // Este campo se asigna automáticamente en el controller
  createdBy: number;
}