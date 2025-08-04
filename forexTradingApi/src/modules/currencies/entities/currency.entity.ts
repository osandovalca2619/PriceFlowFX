import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 3 })
  code: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 4 })
  exchange_rate_to_usd: number;
}
