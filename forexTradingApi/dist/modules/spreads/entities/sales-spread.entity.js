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
exports.SalesSpread = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const currency_entity_1 = require("../../currencies/entities/currency.entity");
const quote_origin_entity_1 = require("../../catalogs/entities/quote-origin.entity");
const segment_entity_1 = require("../../catalogs/entities/segment.entity");
const fx_product_entity_1 = require("../../catalogs/entities/fx-product.entity");
let SalesSpread = class SalesSpread {
    id;
    baseCurrencyId;
    quoteCurrencyId;
    originId;
    segmentId;
    fxProductId;
    marketHours;
    spreadBuy;
    spreadSell;
    createdAt;
    baseCurrency;
    quoteCurrency;
    origin;
    segment;
    fxProduct;
};
exports.SalesSpread = SalesSpread;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the sales spread',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SalesSpread.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'base_currency_id', type: 'integer' }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "baseCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency ID',
        example: 2,
    }),
    (0, typeorm_1.Column)({ name: 'quote_currency_id', type: 'integer' }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "quoteCurrencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote origin ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'origin_id', type: 'integer' }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "originId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Segment ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'segment_id', type: 'integer' }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "segmentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FX Product ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'fx_product_id', type: 'integer' }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "fxProductId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this applies to market hours',
        example: true,
    }),
    (0, typeorm_1.Column)({ name: 'market_hours', type: 'boolean' }),
    __metadata("design:type", Boolean)
], SalesSpread.prototype, "marketHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread for buy operations',
        example: 0.0020,
    }),
    (0, typeorm_1.Column)({ name: 'spread_buy', type: 'numeric', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "spreadBuy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread for sell operations',
        example: 0.0025,
    }),
    (0, typeorm_1.Column)({ name: 'spread_sell', type: 'numeric', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], SalesSpread.prototype, "spreadSell", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when spread was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SalesSpread.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base currency information',
        type: () => currency_entity_1.Currency,
    }),
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'base_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], SalesSpread.prototype, "baseCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote currency information',
        type: () => currency_entity_1.Currency,
    }),
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'quote_currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], SalesSpread.prototype, "quoteCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Quote origin information',
        type: () => quote_origin_entity_1.QuoteOrigin,
    }),
    (0, typeorm_1.ManyToOne)(() => quote_origin_entity_1.QuoteOrigin, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'origin_id' }),
    __metadata("design:type", quote_origin_entity_1.QuoteOrigin)
], SalesSpread.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Segment information',
        type: () => segment_entity_1.Segment,
    }),
    (0, typeorm_1.ManyToOne)(() => segment_entity_1.Segment, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'segment_id' }),
    __metadata("design:type", segment_entity_1.Segment)
], SalesSpread.prototype, "segment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'FX Product information',
        type: () => fx_product_entity_1.FxProduct,
    }),
    (0, typeorm_1.ManyToOne)(() => fx_product_entity_1.FxProduct, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'fx_product_id' }),
    __metadata("design:type", fx_product_entity_1.FxProduct)
], SalesSpread.prototype, "fxProduct", void 0);
exports.SalesSpread = SalesSpread = __decorate([
    (0, typeorm_1.Entity)('sales_spread')
], SalesSpread);
//# sourceMappingURL=sales-spread.entity.js.map