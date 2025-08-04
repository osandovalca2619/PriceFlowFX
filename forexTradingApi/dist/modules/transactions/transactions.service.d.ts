import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionDetail } from './entities/transaction-detail.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
export declare class TransactionsService {
    private transactionsRepository;
    private transactionDetailsRepository;
    private productsRepository;
    constructor(transactionsRepository: Repository<Transaction>, transactionDetailsRepository: Repository<TransactionDetail>, productsRepository: Repository<Product>);
    create(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction>;
    findAll(userId: number): Promise<Transaction[]>;
    findOne(id: number, userId: number): Promise<Transaction>;
}
