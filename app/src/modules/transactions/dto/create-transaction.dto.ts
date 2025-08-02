import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDetailDto } from './transaction-detail.dto';

export class CreateTransactionDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TransactionDetailDto)
  details: TransactionDetailDto[];
}
