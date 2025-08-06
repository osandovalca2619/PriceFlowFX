// forexTradingApi/src/modules/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserProfile } from './user-profile.entity';

@Entity('app_user')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe',
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    maxLength: 100,
  })
  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @ApiProperty({
    description: 'User profile ID',
    example: 1,
  })
  @Column({ name: 'profile_id', type: 'integer' })
  profileId: number;

  @ApiPropertyOptional({
    description: 'Sales group ID',
    example: 1,
  })
  @Column({ name: 'sales_group_id', type: 'integer', nullable: true })
  salesGroupId: number | null;

  @ApiProperty({
    description: 'User status',
    example: 'activo',
    enum: ['activo', 'inactivo'],
  })
  @Column({ type: 'varchar', length: 10, default: 'activo' })
  status: 'activo' | 'inactivo';

  @ApiProperty({
    description: 'ID of user who created this record',
    example: 1,
  })
  @Column({ name: 'created_by', type: 'integer' })
  createdBy: number;

  @ApiProperty({
    description: 'Date when user was created',
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
    description: 'Date when user was last modified',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'modified_at' })
  modifiedAt: Date | null;

  @ApiPropertyOptional({
    description: 'User password (hashed)',
    example: '$2b$10$...',
  })
  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  password?: string;

  // ✅ RELACIÓN CON USER PROFILE
  @ApiProperty({
    description: 'User profile information',
    type: () => UserProfile,
  })
  @ManyToOne(() => UserProfile, profile => profile.users, {
    eager: false,
    nullable: false
  })
  @JoinColumn({ name: 'profile_id' })
  profile: UserProfile;

  // ✅ RELACIONES SELF-REFERENCING CORREGIDAS
  // Estas relaciones son opcionales y no necesitan eager loading
  @ApiPropertyOptional({
    description: 'User who created this record',
    type: () => User,
  })
  @ManyToOne(() => User, {
    nullable: true, // ✅ AGREGADO: nullable para evitar circular dependency
    eager: false,   // ✅ AGREGADO: no cargar automáticamente
  })
  @JoinColumn({ name: 'created_by' })
  creator?: User;

  @ApiPropertyOptional({
    description: 'User who last modified this record',
    type: () => User,
  })
  @ManyToOne(() => User, {
    nullable: true, // ✅ YA ERA nullable
    eager: false,   // ✅ AGREGADO: no cargar automáticamente
  })
  @JoinColumn({ name: 'modified_by' })
  modifier?: User;

  // Relación con transacciones (mantener como estaba)
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // Relaciones opcionales para el futuro
  // @ManyToOne(() => SalesGroup)
  // @JoinColumn({ name: 'sales_group_id' })
  // salesGroup: SalesGroup;
}

// Import circular para evitar problemas de dependencias (mantener al final)
import { Transaction } from '../../transactions/entities/transaction.entity';