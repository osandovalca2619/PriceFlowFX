// forexTradingApi/src/modules/books/dto/create-operation-folder.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { FolderType } from '../entities/operation-folder.entity';

export class CreateOperationFolderDto {
  @ApiProperty({
    description: 'Folder code',
    example: 'MMSSPTX',
    maxLength: 30,
  })
  @IsString()
  @Length(1, 30)
  code: string;

  @ApiProperty({
    description: 'Folder name',
    example: 'Mesa de Money Trading',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Folder type',
    example: FolderType.TRADING,
    enum: FolderType,
  })
  @IsEnum(FolderType)
  folderType: FolderType;

  @ApiPropertyOptional({
    description: 'Folder status',
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


