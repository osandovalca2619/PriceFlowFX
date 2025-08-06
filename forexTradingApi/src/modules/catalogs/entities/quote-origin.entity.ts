// forexTradingApi/src/modules/catalogs/entities/quote-origin.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('quote_origin')
export class QuoteOrigin {
  @ApiProperty({
    description: 'Unique identifier for the quote origin',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Origin code',
    example: 'BLOOMBERG',
    maxLength: 30,
  })
  @Column({ type: 'varchar', length: 30, unique: true })
  code: string;

  @ApiProperty({
    description: 'Origin name',
    example: 'Bloomberg Terminal',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Whether this origin is active',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  active: boolean;
}
