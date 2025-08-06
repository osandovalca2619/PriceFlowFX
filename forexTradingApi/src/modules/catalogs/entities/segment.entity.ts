// forexTradingApi/src/modules/catalogs/entities/segment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('segment')
export class Segment {
  @ApiProperty({
    description: 'Unique identifier for the segment',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Segment name',
    example: 'Premium',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @ApiProperty({
    description: 'Segment description',
    example: 'Clientes premium con beneficios especiales',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;
}