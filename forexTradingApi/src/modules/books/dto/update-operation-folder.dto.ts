// forexTradingApi/src/modules/books/dto/update-operation-folder.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOperationFolderDto } from './create-operation-folder.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateOperationFolderDto extends PartialType(CreateOperationFolderDto) {
  @ApiPropertyOptional({
    description: 'ID of user who modifies this record',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}
