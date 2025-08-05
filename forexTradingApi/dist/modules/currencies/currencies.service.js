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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrenciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const currency_entity_1 = require("./entities/currency.entity");
let CurrenciesService = class CurrenciesService {
    currenciesRepository;
    constructor(currenciesRepository) {
        this.currenciesRepository = currenciesRepository;
    }
    async create(createCurrencyDto) {
        try {
            const existingCurrency = await this.currenciesRepository.findOne({
                where: { code: createCurrencyDto.code }
            });
            if (existingCurrency) {
                throw new common_1.ConflictException(`Currency with code ${createCurrencyDto.code} already exists`);
            }
            const currency = this.currenciesRepository.create({
                ...createCurrencyDto,
                createdAt: new Date(),
            });
            return await this.currenciesRepository.save(currency);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Failed to create currency: ${error.message}`);
        }
    }
    async findAll() {
        return await this.currenciesRepository.find({
            order: { code: 'ASC' }
        });
    }
    async findActive() {
        return await this.currenciesRepository.find({
            where: { status: 'activo' },
            order: { code: 'ASC' }
        });
    }
    async findOne(id) {
        const currency = await this.currenciesRepository.findOne({
            where: { id }
        });
        if (!currency) {
            throw new common_1.NotFoundException(`Currency with ID ${id} not found`);
        }
        return currency;
    }
    async findByCode(code) {
        const currency = await this.currenciesRepository.findOne({
            where: { code: code.toUpperCase() }
        });
        if (!currency) {
            throw new common_1.NotFoundException(`Currency with code ${code} not found`);
        }
        return currency;
    }
    async update(id, updateCurrencyDto) {
        const currency = await this.findOne(id);
        if (updateCurrencyDto.code && updateCurrencyDto.code !== currency.code) {
            const existingCurrency = await this.currenciesRepository.findOne({
                where: { code: updateCurrencyDto.code }
            });
            if (existingCurrency) {
                throw new common_1.ConflictException(`Currency with code ${updateCurrencyDto.code} already exists`);
            }
        }
        Object.assign(currency, updateCurrencyDto);
        currency.modifiedAt = new Date();
        try {
            return await this.currenciesRepository.save(currency);
        }
        catch (error) {
            throw new Error(`Failed to update currency: ${error.message}`);
        }
    }
    async remove(id) {
        const currency = await this.findOne(id);
        try {
            await this.currenciesRepository.remove(currency);
        }
        catch (error) {
            throw new Error(`Failed to delete currency: ${error.message}`);
        }
    }
    async deactivate(id, modifiedBy) {
        return await this.update(id, {
            status: 'inactivo',
            modifiedBy
        });
    }
    async activate(id, modifiedBy) {
        return await this.update(id, {
            status: 'activo',
            modifiedBy
        });
    }
    async getStats() {
        const [total, active, inactive, strongCurrencies] = await Promise.all([
            this.currenciesRepository.count(),
            this.currenciesRepository.count({ where: { status: 'activo' } }),
            this.currenciesRepository.count({ where: { status: 'inactivo' } }),
            this.currenciesRepository.count({ where: { isStrongCurrency: true } })
        ]);
        return {
            total,
            active,
            inactive,
            strongCurrencies,
            lastUpdated: new Date()
        };
    }
};
exports.CurrenciesService = CurrenciesService;
exports.CurrenciesService = CurrenciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(currency_entity_1.Currency)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CurrenciesService);
//# sourceMappingURL=currencies.service.js.map