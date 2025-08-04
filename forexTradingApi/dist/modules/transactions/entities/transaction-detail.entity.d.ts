import { Transaction } from './transaction.entity';
import { Product } from '../../products/entities/product.entity';
export declare class TransactionDetail {
    id: number;
    transaction: Transaction;
    product: Product;
    quantity: number;
    price: number;
}
