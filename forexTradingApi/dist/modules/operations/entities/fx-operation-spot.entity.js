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
exports.FxOperationSpot = exports.OperationSide = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const client_entity_1 = require("../../clients/entities/client.entity");
const currency_entity_1 = require("../../currencies/entities/currency.entity");
const operation_folder_entity_1 = require("../../books/entities/operation-folder.entity");
const fx_operation_status_entity_1 = require("./fx-operation-status.entity");
const quote_origin_entity_1 = require("../../catalogs/entities/quote-origin.entity");
const segment_entity_1 = require("../../catalogs/entities/segment.entity");
var OperationSide;
(function (OperationSide) {
    OperationSide["BUY"] = "buy";
    OperationSide["SELL"] = "sell";
})(OperationSide || (exports.OperationSide = OperationSide = {}));
let FxOperationSpot = class FxOperationSpot {
    id;
    clientId;
    userId;
    amountCurrency1;
    amountCurrency2;
    costPrice;
    margin;
    clientPrice;
    startDate;
    registerDate;
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
    pnlCalculated;
    workflowStep;
    statusId;
    createdBy;
    createdAt;
    modifiedBy;
    modifiedAt;
    client;
    user;
    baseCurrency;
    quoteCurrency;
    origin;
    segment;
    tradingFolder;
    salesFolder;
    status;
    creator;
    modifier;
};
exports.FxOperationSpot = FxOperationSpot;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the FX operation',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client who performs the operation',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'client_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who registers the operation',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'user_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount in currency 1',
        example: 100000.00,
    }),
    (0, typeorm_1.Column)({ name: 'amount_currency1', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "amountCurrency1", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount in currency 2',
        example: 108500.00,
    }),
    (0, typeorm_1.Column)({ name: 'amount_currency2', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "amountCurrency2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cost price for the operation',
        example: 1.085000,
    }),
    (0, typeorm_1.Column)({ name: 'cost_price', type: 'numeric', precision: 18, scale: 6 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "costPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Margin applied to the operation',
        example: 0.0020,
    }),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "margin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client price for the operation',
        example: 1.087000,
    }),
    (0, typeorm_1.Column)({ name: 'client_price', type: 'numeric', precision: 18, scale: 6 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "clientPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Start date of the operation',
        example: '2024-01-15',
    }),
    (0, typeorm_1.Column)({ name: 'start_date', type: 'date' }),
    __metadata("design:type", Date)
], FxOperationSpot.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Registration date of the operation',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.Column)({ name: 'register_date', type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], FxOperationSpot.prototype, "registerDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Value date of the operation',
        example: '2024-01-17',
    }),
    (0, typeorm_1.Column)({ name: 'value_date', type: 'date' }),
    __metadata("design:type", Date)
], FxOperationSpot.prototype, "valueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method for currency 1',
        example: 'WIRE_TRANSFER',
        maxLength: 30,
    }),
    (0, typeorm_1.Column)({ name: 'payment_method_currency1', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], FxOperationSpot.prototype, "paymentMethodCurrency1", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Payment method for currency 2',
        example: 'CASH',
        maxLength: 30,
    }),
    (0, typeorm_1.Column)({ name: 'payment_method_currency2', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], FxOperationSpot.prototype, "paymentMethodCurrency2", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation side',
        example: OperationSide.BUY,
        enum: OperationSide,
    }),
    (0, typeorm_1.Column)({ name: 'operation_side', type: 'enum', enum: OperationSide }),
    __metadata("design:type", String)
], FxOperationSpot.prototype, "operationSide", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'base_currency_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "baseCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency ID',
        example: 2,
    }),
    (0, typeorm_1.Column)({ name: 'quote_currency_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "quoteCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Origin of the quote',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'origin_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client segment ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'segment_id', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "segmentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Destination system ID',
        example: 123,
    }),
    (0, typeorm_1.Column)({ name: 'destination_system_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "destinationSystemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Source system ID',
        example: 456,
    }),
    (0, typeorm_1.Column)({ name: 'source_system_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "sourceSystemId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operation comments',
        example: 'Special client operation',
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], FxOperationSpot.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trading folder ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'trading_folder_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "tradingFolderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales folder ID',
        example: 2,
    }),
    (0, typeorm_1.Column)({ name: 'sales_folder_id', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "salesFolderId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Calculated PnL',
        example: 2000.00,
    }),
    (0, typeorm_1.Column)({ name: 'pnl_calculated', type: 'numeric', precision: 18, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "pnlCalculated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Current workflow step',
        example: 'PENDING_APPROVAL',
        maxLength: 30,
    }),
    (0, typeorm_1.Column)({ name: 'workflow_step', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", String)
], FxOperationSpot.prototype, "workflowStep", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation status ID',
        example: 2,
        default: 2,
    }),
    (0, typeorm_1.Column)({ name: 'status_id', type: 'integer', default: 2 }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "statusId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of user who created this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'created_by', type: 'integer' }),
    __metadata("design:type", Number)
], FxOperationSpot.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when operation was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], FxOperationSpot.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who last modified this record',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'modified_by', type: 'integer', nullable: true }),
    __metadata("design:type", Object)
], FxOperationSpot.prototype, "modifiedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when operation was last modified',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.UpdateDateColumn)({ name: 'modified_at' }),
    __metadata("design:type", Object)
], FxOperationSpot.prototype, "modifiedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client information',
        type: () => client_entity_1.Client,
    }),
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.Client)
], FxOperationSpot.prototype, "client", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User who registered the operation',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], FxOperationSpot.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency information',
        type: () => currency_entity_1.Currency,
    }),
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'base_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], FxOperationSpot.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency information',
        type: () => currency_entity_1.Currency,
    }),
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'quote_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], FxOperationSpot.prototype, "quoteCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote origin information',
        type: () => quote_origin_entity_1.QuoteOrigin,
    }),
    (0, typeorm_1.ManyToOne)(() => quote_origin_entity_1.QuoteOrigin, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'origin_id' }),
    __metadata("design:type", quote_origin_entity_1.QuoteOrigin)
], FxOperationSpot.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Segment information',
        type: () => segment_entity_1.Segment,
    }),
    (0, typeorm_1.ManyToOne)(() => segment_entity_1.Segment, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'segment_id' }),
    __metadata("design:type", segment_entity_1.Segment)
], FxOperationSpot.prototype, "segment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trading folder information',
        type: () => operation_folder_entity_1.OperationFolder,
    }),
    (0, typeorm_1.ManyToOne)(() => operation_folder_entity_1.OperationFolder, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'trading_folder_id' }),
    __metadata("design:type", operation_folder_entity_1.OperationFolder)
], FxOperationSpot.prototype, "tradingFolder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sales folder information',
        type: () => operation_folder_entity_1.OperationFolder,
    }),
    (0, typeorm_1.ManyToOne)(() => operation_folder_entity_1.OperationFolder, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'sales_folder_id' }),
    __metadata("design:type", operation_folder_entity_1.OperationFolder)
], FxOperationSpot.prototype, "salesFolder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Operation status information',
        type: () => fx_operation_status_entity_1.FxOperationStatus,
    }),
    (0, typeorm_1.ManyToOne)(() => fx_operation_status_entity_1.FxOperationStatus, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'status_id' }),
    __metadata("design:type", fx_operation_status_entity_1.FxOperationStatus)
], FxOperationSpot.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who created this record',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], FxOperationSpot.prototype, "creator", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User who last modified this record',
        type: () => user_entity_1.User,
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by' }),
    __metadata("design:type", user_entity_1.User)
], FxOperationSpot.prototype, "modifier", void 0);
exports.FxOperationSpot = FxOperationSpot = __decorate([
    (0, typeorm_1.Entity)('fx_operation_spot')
], FxOperationSpot);
//# sourceMappingURL=fx-operation-spot.entity.js.map