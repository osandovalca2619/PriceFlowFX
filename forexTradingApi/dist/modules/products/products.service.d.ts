import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    findOneCategory(id: number): Promise<Category>;
    updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    removeCategory(id: number): Promise<void>;
    createProduct(createProductDto: CreateProductDto): Promise<Product>;
    findAllProducts(): Promise<Product[]>;
    findOneProduct(id: number): Promise<Product>;
    updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    removeProduct(id: number): Promise<void>;
}
