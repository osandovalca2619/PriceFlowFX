// forexTradingApi/src/modules/clients/dto/query-client.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryClientDto {
  @ApiPropertyOptional({
    description: 'Search by client identifier',
    example: 'CLI001',
  })
  @IsOptional()
  @IsString()
  clientIdentifier?: string;

  @ApiPropertyOptional({
    description: 'Search by client name (partial match)',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by segment ID',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  segmentId?: number;

  @ApiPropertyOptional({
    description: 'Filter by status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'General search query (searches in identifier and name)',
    example: 'Juan CLI001',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;
}