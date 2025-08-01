import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('currency')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 3, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  symbol: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  country: string;

  @Column({ type: 'integer', default: 2 })
  decimals: number;

  @Column({ type: 'boolean' })
  is_strong_currency: boolean;

  @Column()
  created_by: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ nullable: true })
  modified_by: number;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  modified_at: Date;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  status: string;
}
