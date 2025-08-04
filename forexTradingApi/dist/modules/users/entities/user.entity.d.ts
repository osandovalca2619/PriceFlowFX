import { Transaction } from '../../transactions/entities/transaction.entity';
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    full_name: string;
    transactions: Transaction[];
}
