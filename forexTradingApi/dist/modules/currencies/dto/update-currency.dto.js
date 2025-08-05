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
exports.UpdateCurrencyDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class UpdateCurrencyDto {
    code;
    name;
    symbol;
    country;
    decimals;
    isStrongCurrency;
    modifiedBy;
    status;
}
exports.UpdateCurrencyDto = UpdateCurrencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency code (3 characters)',
        example: 'USD',
        maxLength: 3,
        minLength: 3,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 3, { message: 'Currency code must be exactly 3 characters' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toUpperCase()),
    __metadata("design:type", String)
], UpdateCurrencyDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency name',
        example: 'US Dollar',
        maxLength: 50,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateCurrencyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency symbol',
        example: '$',
        maxLength: 5,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 5),
    __metadata("design:type", String)
], UpdateCurrencyDto.prototype, "symbol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country name',
        example: 'United States',
        maxLength: 50,
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 50),
    __metadata("design:type", String)
], UpdateCurrencyDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of decimal places',
        example: 2,
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateCurrencyDto.prototype, "decimals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this is a strong currency',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateCurrencyDto.prototype, "isStrongCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the user modifying this currency',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateCurrencyDto.prototype, "modifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency status',
        example: 'activo',
        enum: ['activo', 'inactivo'],
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['activo', 'inactivo']),
    __metadata("design:type", String)
], UpdateCurrencyDto.prototype, "status", void 0);
//# sourceMappingURL=update-currency.dto.js.map