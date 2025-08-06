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
exports.CreateTradingSpreadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateTradingSpreadDto {
    currencyId;
    scenarioId;
    amountMin;
    amountMax;
    spread;
}
exports.CreateTradingSpreadDto = CreateTradingSpreadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTradingSpreadDto.prototype, "currencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Market scenario ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTradingSpreadDto.prototype, "scenarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum amount for this range',
        example: 0.00,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTradingSpreadDto.prototype, "amountMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum amount for this range',
        example: 500000.00,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTradingSpreadDto.prototype, "amountMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread applied in this range',
        example: 0.0020,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1),
    __metadata("design:type", Number)
], CreateTradingSpreadDto.prototype, "spread", void 0);
//# sourceMappingURL=create-trading-spread.dto.js.map