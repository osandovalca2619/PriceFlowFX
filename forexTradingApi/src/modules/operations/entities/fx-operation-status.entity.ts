// forexTradingApi/src/modules/catalogs/entities/fx-operation-status.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fx_operation_status')
export class FxOperationStatus {
  @ApiProperty({
    description: 'Unique identifier for the status',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Status code',
    example: 'completa',
    maxLength: 30,
  })
  @Column({ type: 'varchar', length: 30, unique: true })
  code: string;

  @ApiProperty({
    description: 'Status description',
    example: 'Operación completada',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  description: string;

  @ApiProperty({
    description: 'Display order for UI',
    example: 1,
  })
  @Column({ name: 'display_order', type: 'integer' })
  displayOrder: number;
}