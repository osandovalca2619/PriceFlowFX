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
exports.CreateFxOperationSpotDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const fx_operation_spot_entity_1 = require("../entities/fx-operation-spot.entity");
class CreateFxOperationSpotDto {
    clientId;
    userId;
    amountCurrency1;
    amountCurrency2;
    costPrice;
    margin;
    clientPrice;
    startDate;
    valueDate;
    paymentMethodCurrency1;
    paymentMethodCurrency2;
    operationSide;
    baseCurrencyId;
    quoteCurrencyId;
    originId;
    segmentId;
    destinationSystemId;
    sourceSystemId;
    comments;
    tradingFolderId;
    salesFolderId;
    workflowStep;
    statusId = 2;
    createdBy;
}
exports.CreateFxOperationSpotDto = CreateFxOperationSpotDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client who performs the operation',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who registers the operation',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount in currency 1',
        example: 100000.00,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "amountCurrency1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount in currency 2',
        example: 108500.00,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "amountCurrency2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost price for the operation',
        example: 1.085000,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 6 }),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Margin applied to the operation',
        example: 0.0020,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "margin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client price for the operation',
        example: 1.087000,
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 6 }),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "clientPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the operation',
        example: '2024-01-15',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Value date of the operation',
        example: '2024-01-17',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "valueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method for currency 1',
        example: 'WIRE_TRANSFER',
        maxLength: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "paymentMethodCurrency1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method for currency 2',
        example: 'CASH',
        maxLength: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "paymentMethodCurrency2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation side',
        example: fx_operation_spot_entity_1.OperationSide.BUY,
        enum: fx_operation_spot_entity_1.OperationSide,
    }),
    (0, class_validator_1.IsEnum)(fx_operation_spot_entity_1.OperationSide),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "operationSide", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "baseCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency ID',
        example: 2,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "quoteCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Origin of the quote',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client segment ID',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "segmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination system ID',
        example: 123,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "destinationSystemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source system ID',
        example: 456,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "sourceSystemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operation comments',
        example: 'Special client operation',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trading folder ID',
        example: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "tradingFolderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales folder ID',
        example: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "salesFolderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current workflow step',
        example: 'PENDING_APPROVAL',
        maxLength: 30,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 30),
    __metadata("design:type", String)
], CreateFxOperationSpotDto.prototype, "workflowStep", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operation status ID',
        example: 2,
        default: 2,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFxOperationSpotDto.prototype, "statusId", void 0);
//# sourceMappingURL=create-fx-operation-spot.dto.js.map