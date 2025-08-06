// forexTradingApi/src/modules/clients/entities/client.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Segment } from '../../catalogs/entities/segment.entity';

@Entity('client')
export class Client {
  @ApiProperty({
    description: 'Unique identifier for the client',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Client internal identifier',
    example: 'CLI001234',
    maxLength: 50,
  })
  @Column({ name: 'client_identifier', type: 'varchar', length: 50, unique: true })
  clientIdentifier: string;

  @ApiProperty({
    description: 'Client full name',
    example: 'Juan Pérez González',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Client segment ID',
    example: 1,
  })
  @Column({ name: 'segment_id', type: 'integer' })
  segmentId: number;

  @ApiProperty({
    description: 'Client status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  @Column({ type: 'varchar', length: 10, default: 'activo' })
  status: string;

  @ApiProperty({
    description: 'ID of user who created this record',
    example: 1,
  })
  @Column({ name: 'created_by', type: 'integer' })
  createdBy: number;

  @ApiProperty({
    description: 'Date when client was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'ID of user who last modified this record',
    example: 1,
  })
  @Column({ name: 'modified_by', type: 'integer', nullable: true })
  modifiedBy: number | null;

  @ApiPropertyOptional({
    description: 'Date when client was last modified',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date | null;

  // Relations
  @ApiProperty({
    description: 'Client segment information',
    type: () => Segment,
  })
  @ManyToOne(() => Segment, { nullable: false, eager: false })
  @JoinColumn({ name: 'segment_id' })
  segment: Segment;

  @ApiPropertyOptional({
    description: 'User who created this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: false, eager: false })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ApiPropertyOptional({
    description: 'User who last modified this record',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'modified_by' })
  modifier: User;
}