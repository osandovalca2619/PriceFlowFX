// forexTradingApi/src/modules/books/entities/operation-folder.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum FolderType {
  TRADING = 'trading',
  SALES = 'sales',
}

@Entity('operation_folder')
export class OperationFolder {
  @ApiProperty({
    description: 'Unique identifier for the operation folder',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Folder code',
    example: 'MMSSPTX',
    maxLength: 30,
  })
  @Column({ type: 'varchar', length: 30, unique: true })
  code: string;

  @ApiProperty({
    description: 'Folder name',
    example: 'Mesa de Money Trading',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Folder type',
    example: FolderType.TRADING,
    enum: FolderType,
  })
  @Column({ name: 'folder_type', type: 'enum', enum: FolderType })
  folderType: FolderType;

  @ApiProperty({
    description: 'Folder status',
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
    description: 'Date when folder was created',
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
    description: 'Date when folder was last modified',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date | null;

  // Relations
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