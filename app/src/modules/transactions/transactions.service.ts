import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionDetail } from './entities/transaction-detail.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private transactionDetailsRepository: Repository<TransactionDetail>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, user: User): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({ user });
    const savedTransaction = await this.transactionsRepository.save(transaction);

    const details = await Promise.all(
      createTransactionDto.details.map(async (detailDto) => {
        const product = await this.productsRepository.findOne({ where: { id: detailDto.productId } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${detailDto.productId} not found`);
        }
        const detail = this.transactionDetailsRepository.create({
          ...detailDto,
          product,
          transaction: savedTransaction,
        });
        return this.transactionDetailsRepository.save(detail);
      }),
    );

    savedTransaction.details = details;
    return savedTransaction;
  }

  findAll(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      relations: ['details', 'details.product'],
    });
  }

  async findOne(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['details', 'details.product'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }
}
