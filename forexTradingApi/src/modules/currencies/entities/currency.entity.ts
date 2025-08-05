// forexTradingApi/src/modules/currencies/entities/currency.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Ajusta la ruta según tu estructura

@Entity('currency')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    unique: true, 
    length: 3,
    transformer: {
      to: (value: string) => value?.toUpperCase(),
      from: (value: string) => value
    }
  })
  code: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 5, nullable: true })
  symbol: string;

  @Column({ length: 50, nullable: true })
  country: string;

  @Column({ default: 2 })
  decimals: number;

  @Column({ name: 'is_strong_currency' })
  isStrongCurrency: boolean;

  @Column({ name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'modified_by', nullable: true })
  modifiedBy: number;

  @UpdateDateColumn({ name: 'modified_at', nullable: true })
  modifiedAt: Date;

  @Column({ length: 20, default: 'activo' })
  status: string;

  // Relaciones
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modified_by' })
  modifier: User;
}