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
exports.CreateSalesSpreadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateSalesSpreadDto {
    baseCurrencyId;
    quoteCurrencyId;
    originId;
    segmentId;
    fxProductId;
    marketHours;
    spreadBuy;
    spreadSell;
}
exports.CreateSalesSpreadDto = CreateSalesSpreadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "baseCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency ID',
        example: 2,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "quoteCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote origin ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Segment ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "segmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FX Product ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "fxProductId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this applies to market hours',
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSalesSpreadDto.prototype, "marketHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread for buy operations',
        example: 0.0020,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "spreadBuy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread for sell operations',
        example: 0.0025,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateSalesSpreadDto.prototype, "spreadSell", void 0);
//# sourceMappingURL=create-sales-spread.dto.js.map