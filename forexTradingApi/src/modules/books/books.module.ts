// forexTradingApi/src/modules/books/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationFoldersService } from './operation-folders.service';
import { OperationFoldersController } from './operation-folders.controller';
import { OperationFolder } from './entities/operation-folder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OperationFolder]),
  ],
  controllers: [OperationFoldersController],
  providers: [OperationFoldersService],
  exports: [OperationFoldersService, TypeOrmModule],
})
export class BooksModule {}