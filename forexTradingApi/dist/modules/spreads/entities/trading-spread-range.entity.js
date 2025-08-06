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
exports.TradingSpreadRange = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const currency_entity_1 = require("../../currencies/entities/currency.entity");
const market_scenario_entity_1 = require("../../catalogs/entities/market-scenario.entity");
let TradingSpreadRange = class TradingSpreadRange {
    id;
    currencyId;
    scenarioId;
    amountMin;
    amountMax;
    spread;
    createdAt;
    currency;
    scenario;
};
exports.TradingSpreadRange = TradingSpreadRange;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the trading spread range',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'currency_id', type: 'integer' }),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "currencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Market scenario ID',
        example: 1,
    }),
    (0, typeorm_1.Column)({ name: 'scenario_id', type: 'integer' }),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "scenarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Minimum amount for this range',
        example: 0.00,
    }),
    (0, typeorm_1.Column)({ name: 'amount_min', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "amountMin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum amount for this range',
        example: 500000.00,
    }),
    (0, typeorm_1.Column)({ name: 'amount_max', type: 'numeric', precision: 18, scale: 2 }),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "amountMax", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Spread applied in this range',
        example: 0.0020,
    }),
    (0, typeorm_1.Column)({ type: 'numeric', precision: 8, scale: 4 }),
    __metadata("design:type", Number)
], TradingSpreadRange.prototype, "spread", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when range was created',
        example: '2024-01-15T10:30:00Z',
    }),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TradingSpreadRange.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Currency information',
        type: () => currency_entity_1.Currency,
    }),
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.Currency, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'currency_id' }),
    __metadata("design:type", currency_entity_1.Currency)
], TradingSpreadRange.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Market scenario information',
        type: () => market_scenario_entity_1.MarketScenario,
    }),
    (0, typeorm_1.ManyToOne)(() => market_scenario_entity_1.MarketScenario, { nullable: false, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'scenario_id' }),
    __metadata("design:type", market_scenario_entity_1.MarketScenario)
], TradingSpreadRange.prototype, "scenario", void 0);
exports.TradingSpreadRange = TradingSpreadRange = __decorate([
    (0, typeorm_1.Entity)('trading_spread_range')
], TradingSpreadRange);
//# sourceMappingURL=trading-spread-range.entity.js.map