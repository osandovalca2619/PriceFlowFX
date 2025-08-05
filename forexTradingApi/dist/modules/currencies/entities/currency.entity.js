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
exports.Currency = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Currency = class Currency {
    id;
    code;
    name;
    symbol;
    country;
    decimals;
    isStrongCurrency;
    createdBy;
    createdAt;
    modifiedBy;
    modifiedAt;
    status;
    creator;
    modifier;
};
exports.Currency = Currency;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Currency.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        length: 3,
        transformer: {
            to: (value) => value?.toUpperCase(),
            from: (value) => value
        }
    }),
    __metadata("design:type", String)
], Currency.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Currency.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 5, nullable: true }),
    __metadata("design:type", String)
], Currency.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Currency.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 2 }),
    __metadata("design:type", Number)
], Currency.prototype, "decimals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_strong_currency' }),
    __metadata("design:type", Boolean)
], Currency.prototype, "isStrongCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", Number)
], Currency.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Currency.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modified_by', nullable: true }),
    __metadata("design:type", Number)
], Currency.prototype, "modifiedBy", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'modified_at', nullable: true }),
    __metadata("design:type", Date)
], Currency.prototype, "modifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'activo' }),
    __metadata("design:type", String)
], Currency.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Currency.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'modified_by' }),
    __metadata("design:type", user_entity_1.User)
], Currency.prototype, "modifier", void 0);
exports.Currency = Currency = __decorate([
    (0, typeorm_1.Entity)('currency')
], Currency);
//# sourceMappingURL=currency.entity.js.map