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
exports.MarketScenario = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let MarketScenario = class MarketScenario {
    id;
    code;
    name;
    description;
    volatilityMultiplier;
    active;
};
exports.MarketScenario = MarketScenario;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the market scenario',
        example: 1,
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MarketScenario.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scenario code',
        example: 'NORMAL',
        maxLength: 20,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true }),
    __metadata("design:type", String)
], MarketScenario.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scenario name',
        example: 'Normal Market',
        maxLength: 50,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MarketScenario.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Scenario description',
        example: 'Condiciones normales de mercado',
        maxLength: 100,
    }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], MarketScenario.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Volatility multiplier for this scenario',
        example: 1.0,
    }),
    (0, typeorm_1.Column)({ name: 'volatility_multiplier', type: 'numeric', precision: 4, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], MarketScenario.prototype, "volatilityMultiplier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this scenario is active',
        example: true,
        default: true,
    }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], MarketScenario.prototype, "active", void 0);
exports.MarketScenario = MarketScenario = __decorate([
    (0, typeorm_1.Entity)('market_scenario')
], MarketScenario);
//# sourceMappingURL=market-scenario.entity.js.map