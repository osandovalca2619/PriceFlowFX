import { Category } from './category.entity';
import { TransactionDetail } from '../../transactions/entities/transaction-detail.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    transactionDetails: TransactionDetail[];
}
