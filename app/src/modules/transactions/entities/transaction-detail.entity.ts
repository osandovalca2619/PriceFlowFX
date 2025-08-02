import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Transaction } from './transaction.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('transaction_details')
export class TransactionDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.details)
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionDetails)
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;
}
