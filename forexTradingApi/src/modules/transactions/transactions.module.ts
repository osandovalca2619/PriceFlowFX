import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { TransactionDetail } from './entities/transaction-detail.entity'; // Si existe
import { ProductsModule } from '../products/products.module'; // Importar ProductsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionDetail, // Si existe esta entidad
    ]),
    ProductsModule, // Importar el módulo de productos para acceder a ProductRepository
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}