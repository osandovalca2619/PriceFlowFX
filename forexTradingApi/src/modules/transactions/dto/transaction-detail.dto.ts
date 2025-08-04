import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class TransactionDetailDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
