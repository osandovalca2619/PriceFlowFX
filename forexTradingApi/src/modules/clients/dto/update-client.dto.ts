// forexTradingApi/src/modules/clients/dto/update-client.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
import { IsOptional, IsInt } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    description: 'ID of user who modifies this record',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  modifiedBy?: number;
}