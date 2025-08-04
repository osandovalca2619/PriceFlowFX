import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProductsService],
  controllers: [ProductsController, CategoriesController],
  exports: [
    ProductsService,
    TypeOrmModule, // 👈 ESTO ES LO QUE FALTABA - Exportar TypeOrmModule
  ],
})
export class ProductsModule {}