import { User } from '../../users/entities/user.entity';
import { TransactionDetail } from './transaction-detail.entity';
export declare class Transaction {
    id: number;
    transaction_date: Date;
    user: User;
    details: TransactionDetail[];
}
