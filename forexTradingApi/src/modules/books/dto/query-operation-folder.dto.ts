// forexTradingApi/src/modules/books/dto/query-operation-folder.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { FolderType } from '../entities/operation-folder.entity';

export class QueryOperationFolderDto {
  @ApiPropertyOptional({
    description: 'Filter by folder type',
    example: FolderType.TRADING,
    enum: FolderType,
  })
  @IsOptional()
  @IsEnum(FolderType)
  folderType?: FolderType;

  @ApiPropertyOptional({
    description: 'Filter by folder status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by folder code (partial match)',
    example: 'MMSS',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    description: 'Filter by folder name (partial match)',
    example: 'Trading',
  })
  @IsOptional()
  @IsString()
  name?: string;
}