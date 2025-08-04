import type { Request as ExpressRequest } from 'express';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
interface AuthenticatedRequest extends ExpressRequest {
    user: any;
}
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto, req: AuthenticatedRequest): Promise<import("./entities/transaction.entity").Transaction>;
    findAll(req: AuthenticatedRequest): Promise<import("./entities/transaction.entity").Transaction[]>;
    findOne(id: number, req: AuthenticatedRequest): Promise<import("./entities/transaction.entity").Transaction>;
}
export {};
