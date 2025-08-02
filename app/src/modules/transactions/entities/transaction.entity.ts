import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TransactionDetail } from './transaction-detail.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  transaction_date: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @OneToMany(() => TransactionDetail, (detail) => detail.transaction, { cascade: true })
  details: TransactionDetail[];
}
