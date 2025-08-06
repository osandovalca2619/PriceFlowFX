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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FxProduct = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let FxProduct = class FxProduct {
    id;
    code;
    name;
    description;
    active;
};
exports.FxProduct = FxProduct;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the FX product',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FxProduct.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product code',
        example: 'SPOT',
        maxLength: 20,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], FxProduct.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product name',
        example: 'Spot FX',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], FxProduct.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product description',
        example: 'Operaciones de cambio al contado',
        maxLength: 200,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true }),
    __metadata("design:type", String)
], FxProduct.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this product is active',
        example: true,
        default: true,
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], FxProduct.prototype, "active", void 0);
exports.FxProduct = FxProduct = __decorate([
    (0, typeorm_1.Entity)('fx_product')
], FxProduct);
//# sourceMappingURL=fx-product.entity.js.map