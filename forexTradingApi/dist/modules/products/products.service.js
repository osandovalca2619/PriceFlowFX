"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesRepository;
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    createCategory(createCategoryDto) {
        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }
    findAllCategories() {
        return this.categoriesRepository.find();
    }
    async findOneCategory(id) {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.categoriesRepository.preload({
            id,
            ...updateCategoryDto,
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
        return this.categoriesRepository.save(category);
    }
    async removeCategory(id) {
        const result = await this.categoriesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found`);
        }
    }
    async createProduct(createProductDto) {
        const category = await this.findOneCategory(createProductDto.categoryId);
        const product = this.productsRepository.create({
            ...createProductDto,
            category,
        });
        return this.productsRepository.save(product);
    }
    findAllProducts() {
        return this.productsRepository.find({ relations: ['category'] });
    }
    async findOneProduct(id) {
        const product = await this.productsRepository.findOne({ where: { id }, relations: ['category'] });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async updateProduct(id, updateProductDto) {
        const product = await this.productsRepository.preload({
            id,
            ...updateProductDto,
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return this.productsRepository.save(product);
    }
    async removeProduct(id) {
        const result = await this.productsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map