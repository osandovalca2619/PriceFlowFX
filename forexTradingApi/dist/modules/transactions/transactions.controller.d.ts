import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, req: any): Promise<import("./entities/transaction.entity").Transaction>;
    findAll(req: any): Promise<import("./entities/transaction.entity").Transaction[]>;
    findOne(id: number, req: any): Promise<import("./entities/transaction.entity").Transaction>;
}
