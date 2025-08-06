// forexTradingApi/src/modules/catalogs/entities/fx-product.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fx_product')
export class FxProduct {
  @ApiProperty({
    description: 'Unique identifier for the FX product',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Product code',
    example: 'SPOT',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20, unique: true })
  code: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Spot FX',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Operaciones de cambio al contado',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string;

  @ApiProperty({
    description: 'Whether this product is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  active: boolean;
}
