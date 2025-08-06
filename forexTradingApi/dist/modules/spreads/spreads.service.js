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
exports.SpreadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trading_spread_range_entity_1 = require("./entities/trading-spread-range.entity");
const sales_spread_entity_1 = require("./entities/sales-spread.entity");
let SpreadsService = class SpreadsService {
    tradingSpreadRepository;
    salesSpreadRepository;
    constructor(tradingSpreadRepository, salesSpreadRepository) {
        this.tradingSpreadRepository = tradingSpreadRepository;
        this.salesSpreadRepository = salesSpreadRepository;
    }
    async createTradingSpread(createSpreadDto) {
        const overlappingSpread = await this.tradingSpreadRepository
            .createQueryBuilder('spread')
            .where('spread.currencyId = :currencyId', { currencyId: createSpreadDto.currencyId })
            .andWhere('spread.scenarioId = :scenarioId', { scenarioId: createSpreadDto.scenarioId })
            .andWhere('(spread.amountMin <= :amountMax AND spread.amountMax >= :amountMin)', {
            amountMin: createSpreadDto.amountMin,
            amountMax: createSpreadDto.amountMax
        })
            .getOne();
        if (overlappingSpread) {
            throw new common_1.ConflictException('Amount range overlaps with existing spread configuration');
        }
        const spread = this.tradingSpreadRepository.create(createSpreadDto);
        return this.tradingSpreadRepository.save(spread);
    }
    async findAllTradingSpreads(queryDto) {
        const query = this.tradingSpreadRepository.createQueryBuilder('spread')
            .leftJoinAndSelect('spread.currency', 'currency')
            .leftJoinAndSelect('spread.scenario', 'scenario');
        if (queryDto?.currencyId) {
            query.andWhere('spread.currencyId = :currencyId', { currencyId: queryDto.currencyId });
        }
        if (queryDto?.scenarioId) {
            query.andWhere('spread.scenarioId = :scenarioId', { scenarioId: queryDto.scenarioId });
        }
        if (queryDto?.currencyCode) {
            query.andWhere('currency.code = :currencyCode', { currencyCode: queryDto.currencyCode.toUpperCase() });
        }
        if (queryDto?.scenarioCode) {
            query.andWhere('scenario.code = :scenarioCode', { scenarioCode: queryDto.scenarioCode.toUpperCase() });
        }
        return query
            .orderBy('currency.code', 'ASC')
            .addOrderBy('scenario.volatilityMultiplier', 'ASC')
            .addOrderBy('spread.amountMin', 'ASC')
            .getMany();
    }
    async findTradingSpreadById(id) {
        const spread = await this.tradingSpreadRepository.findOne({
            where: { id },
            relations: ['currency', 'scenario']
        });
        if (!spread) {
            throw new common_1.NotFoundException(`Trading spread with ID ${id} not found`);
        }
        return spread;
    }
    async findTradingSpreadsByCurrency(currencyId) {
        return this.tradingSpreadRepository.find({
            where: { currencyId },
            relations: ['currency', 'scenario'],
            order: {
                scenarioId: 'ASC',
                amountMin: 'ASC'
            }
        });
    }
    async updateTradingSpread(id, updateSpreadDto) {
        const spread = await this.findTradingSpreadById(id);
        if (updateSpreadDto.amountMin !== undefined || updateSpreadDto.amountMax !== undefined) {
            const newAmountMin = updateSpreadDto.amountMin ?? spread.amountMin;
            const newAmountMax = updateSpreadDto.amountMax ?? spread.amountMax;
            const currencyId = updateSpreadDto.currencyId ?? spread.currencyId;
            const scenarioId = updateSpreadDto.scenarioId ?? spread.scenarioId;
            const overlappingSpread = await this.tradingSpreadRepository
                .createQueryBuilder('spread')
                .where('spread.id != :id', { id })
                .andWhere('spread.currencyId = :currencyId', { currencyId })
                .andWhere('spread.scenarioId = :scenarioId', { scenarioId })
                .andWhere('(spread.amountMin <= :amountMax AND spread.amountMax >= :amountMin)', { amountMin: newAmountMin, amountMax: newAmountMax })
                .getOne();
            if (overlappingSpread) {
                throw new common_1.ConflictException('Amount range overlaps with existing spread configuration');
            }
        }
        await this.tradingSpreadRepository.update(id, updateSpreadDto);
        return this.findTradingSpreadById(id);
    }
    async deleteTradingSpread(id) {
        const spread = await this.findTradingSpreadById(id);
        await this.tradingSpreadRepository.remove(spread);
    }
    async createSalesSpread(createSpreadDto) {
        const existingSpread = await this.salesSpreadRepository.findOne({
            where: {
                baseCurrencyId: createSpreadDto.baseCurrencyId,
                quoteCurrencyId: createSpreadDto.quoteCurrencyId,
                originId: createSpreadDto.originId,
                segmentId: createSpreadDto.segmentId,
                fxProductId: createSpreadDto.fxProductId,
                marketHours: createSpreadDto.marketHours,
            }
        });
        if (existingSpread) {
            throw new common_1.ConflictException('Sales spread configuration already exists for this combination');
        }
        const spread = this.salesSpreadRepository.create(createSpreadDto);
        return this.salesSpreadRepository.save(spread);
    }
    async findAllSalesSpreads(queryDto) {
        const query = this.salesSpreadRepository.createQueryBuilder('spread')
            .leftJoinAndSelect('spread.baseCurrency', 'baseCurrency')
            .leftJoinAndSelect('spread.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('spread.origin', 'origin')
            .leftJoinAndSelect('spread.segment', 'segment')
            .leftJoinAndSelect('spread.fxProduct', 'fxProduct');
        if (queryDto?.baseCurrencyId) {
            query.andWhere('spread.baseCurrencyId = :baseCurrencyId', { baseCurrencyId: queryDto.baseCurrencyId });
        }
        if (queryDto?.quoteCurrencyId) {
            query.andWhere('spread.quoteCurrencyId = :quoteCurrencyId', { quoteCurrencyId: queryDto.quoteCurrencyId });
        }
        if (queryDto?.originId) {
            query.andWhere('spread.originId = :originId', { originId: queryDto.originId });
        }
        if (queryDto?.segmentId) {
            query.andWhere('spread.segmentId = :segmentId', { segmentId: queryDto.segmentId });
        }
        if (queryDto?.fxProductId) {
            query.andWhere('spread.fxProductId = :fxProductId', { fxProductId: queryDto.fxProductId });
        }
        if (queryDto?.marketHours !== undefined) {
            query.andWhere('spread.marketHours = :marketHours', { marketHours: queryDto.marketHours });
        }
        if (queryDto?.currencyPair) {
            const [base, quote] = queryDto.currencyPair.split('/');
            if (base && quote) {
                query.andWhere('baseCurrency.code = :base AND quoteCurrency.code = :quote', { base, quote });
            }
        }
        return query
            .orderBy('baseCurrency.code', 'ASC')
            .addOrderBy('quoteCurrency.code', 'ASC')
            .addOrderBy('origin.code', 'ASC')
            .addOrderBy('segment.name', 'ASC')
            .getMany();
    }
    async findSalesSpreadById(id) {
        const spread = await this.salesSpreadRepository.findOne({
            where: { id },
            relations: ['baseCurrency', 'quoteCurrency', 'origin', 'segment', 'fxProduct']
        });
        if (!spread) {
            throw new common_1.NotFoundException(`Sales spread with ID ${id} not found`);
        }
        return spread;
    }
    async findSalesSpreadsByOrigin(originId) {
        return this.salesSpreadRepository.find({
            where: { originId },
            relations: ['baseCurrency', 'quoteCurrency', 'origin', 'segment', 'fxProduct'],
            order: {
                baseCurrencyId: 'ASC',
                quoteCurrencyId: 'ASC',
                segmentId: 'ASC'
            }
        });
    }
    async findSalesSpreadsBySegment(segmentId) {
        return this.salesSpreadRepository.find({
            where: { segmentId },
            relations: ['baseCurrency', 'quoteCurrency', 'origin', 'segment', 'fxProduct'],
            order: {
                baseCurrencyId: 'ASC',
                quoteCurrencyId: 'ASC',
                originId: 'ASC'
            }
        });
    }
    async updateSalesSpread(id, updateSpreadDto) {
        const spread = await this.findSalesSpreadById(id);
        if (updateSpreadDto.baseCurrencyId !== undefined ||
            updateSpreadDto.quoteCurrencyId !== undefined ||
            updateSpreadDto.originId !== undefined ||
            updateSpreadDto.segmentId !== undefined ||
            updateSpreadDto.fxProductId !== undefined ||
            updateSpreadDto.marketHours !== undefined) {
            const existingSpread = await this.salesSpreadRepository.findOne({
                where: {
                    baseCurrencyId: updateSpreadDto.baseCurrencyId ?? spread.baseCurrencyId,
                    quoteCurrencyId: updateSpreadDto.quoteCurrencyId ?? spread.quoteCurrencyId,
                    originId: updateSpreadDto.originId ?? spread.originId,
                    segmentId: updateSpreadDto.segmentId ?? spread.segmentId,
                    fxProductId: updateSpreadDto.fxProductId ?? spread.fxProductId,
                    marketHours: updateSpreadDto.marketHours ?? spread.marketHours,
                }
            });
            if (existingSpread && existingSpread.id !== id) {
                throw new common_1.ConflictException('Sales spread configuration already exists for this combination');
            }
        }
        await this.salesSpreadRepository.update(id, updateSpreadDto);
        return this.findSalesSpreadById(id);
    }
    async deleteSalesSpread(id) {
        const spread = await this.findSalesSpreadById(id);
        await this.salesSpreadRepository.remove(spread);
    }
    async getApplicableSpread(params) {
        const tradingSpread = await this.tradingSpreadRepository
            .createQueryBuilder('spread')
            .where('spread.currencyId = :currencyId', {
            currencyId: params.baseCurrencyId
        })
            .andWhere('spread.scenarioId = :scenarioId', {
            scenarioId: params.scenarioId
        })
            .andWhere('spread.amountMin <= :amount', { amount: params.amount })
            .andWhere('spread.amountMax >= :amount', { amount: params.amount })
            .getOne();
        const salesSpread = await this.salesSpreadRepository.findOne({
            where: {
                baseCurrencyId: params.baseCurrencyId,
                quoteCurrencyId: params.quoteCurrencyId,
                originId: params.originId,
                segmentId: params.segmentId,
                fxProductId: params.fxProductId,
                marketHours: params.marketHours,
            }
        });
        return {
            tradingSpread: tradingSpread?.spread,
            salesSpread: salesSpread ? {
                buy: salesSpread.spreadBuy,
                sell: salesSpread.spreadSell
            } : undefined
        };
    }
    async getTradingSpreadMatrix(currencyId) {
        const spreads = await this.tradingSpreadRepository.find({
            where: { currencyId },
            relations: ['currency', 'scenario'],
            order: {
                scenarioId: 'ASC',
                amountMin: 'ASC'
            }
        });
        if (spreads.length === 0) {
            throw new common_1.NotFoundException(`No trading spreads found for currency ID ${currencyId}`);
        }
        const currency = spreads[0].currency.code;
        const scenariosMap = new Map();
        spreads.forEach(spread => {
            if (!scenariosMap.has(spread.scenarioId)) {
                scenariosMap.set(spread.scenarioId, {
                    scenarioId: spread.scenarioId,
                    scenarioName: spread.scenario.name,
                    ranges: []
                });
            }
            scenariosMap.get(spread.scenarioId).ranges.push({
                amountMin: spread.amountMin,
                amountMax: spread.amountMax,
                spread: spread.spread
            });
        });
        return {
            currency,
            scenarios: Array.from(scenariosMap.values())
        };
    }
    async getSalesSpreadMatrix(filters) {
        const query = this.salesSpreadRepository.createQueryBuilder('spread')
            .leftJoinAndSelect('spread.baseCurrency', 'baseCurrency')
            .leftJoinAndSelect('spread.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('spread.origin', 'origin')
            .leftJoinAndSelect('spread.segment', 'segment')
            .leftJoinAndSelect('spread.fxProduct', 'fxProduct');
        if (filters?.baseCurrencyId) {
            query.andWhere('spread.baseCurrencyId = :baseCurrencyId', { baseCurrencyId: filters.baseCurrencyId });
        }
        if (filters?.quoteCurrencyId) {
            query.andWhere('spread.quoteCurrencyId = :quoteCurrencyId', { quoteCurrencyId: filters.quoteCurrencyId });
        }
        if (filters?.originId) {
            query.andWhere('spread.originId = :originId', { originId: filters.originId });
        }
        const spreads = await query.getMany();
        const grouped = new Map();
        spreads.forEach(spread => {
            const pair = `${spread.baseCurrency.code}/${spread.quoteCurrency.code}`;
            const origin = spread.origin.code;
            const key = `${pair}-${origin}`;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    pair,
                    origin,
                    segments: new Map()
                });
            }
            const group = grouped.get(key);
            const segmentKey = spread.segment.name;
            if (!group.segments.has(segmentKey)) {
                group.segments.set(segmentKey, {
                    segmentName: segmentKey,
                    marketHours: { buy: 0, sell: 0 },
                    afterHours: { buy: 0, sell: 0 }
                });
            }
            const segment = group.segments.get(segmentKey);
            if (spread.marketHours) {
                segment.marketHours.buy = spread.spreadBuy;
                segment.marketHours.sell = spread.spreadSell;
            }
            else {
                segment.afterHours.buy = spread.spreadBuy;
                segment.afterHours.sell = spread.spreadSell;
            }
        });
        return Array.from(grouped.values()).map(group => ({
            ...group,
            segments: Array.from(group.segments.values())
        }));
    }
    async getSpreadStats() {
        const [tradingTotal, tradingByCurrency, tradingByScenario, salesTotal, salesByOrigin, salesBySegment] = await Promise.all([
            this.tradingSpreadRepository.count(),
            this.tradingSpreadRepository
                .createQueryBuilder('spread')
                .leftJoin('spread.currency', 'currency')
                .select('currency.code', 'currency')
                .addSelect('COUNT(*)', 'count')
                .groupBy('currency.code')
                .getRawMany(),
            this.tradingSpreadRepository
                .createQueryBuilder('spread')
                .leftJoin('spread.scenario', 'scenario')
                .select('scenario.name', 'scenario')
                .addSelect('COUNT(*)', 'count')
                .groupBy('scenario.name')
                .getRawMany(),
            this.salesSpreadRepository.count(),
            this.salesSpreadRepository
                .createQueryBuilder('spread')
                .leftJoin('spread.origin', 'origin')
                .select('origin.name', 'origin')
                .addSelect('COUNT(*)', 'count')
                .groupBy('origin.name')
                .getRawMany(),
            this.salesSpreadRepository
                .createQueryBuilder('spread')
                .leftJoin('spread.segment', 'segment')
                .select('segment.name', 'segment')
                .addSelect('COUNT(*)', 'count')
                .groupBy('segment.name')
                .getRawMany()
        ]);
        return {
            trading: {
                total: tradingTotal,
                byCurrency: tradingByCurrency.map(item => ({
                    currency: item.currency,
                    count: parseInt(item.count)
                })),
                byScenario: tradingByScenario.map(item => ({
                    scenario: item.scenario,
                    count: parseInt(item.count)
                }))
            },
            sales: {
                total: salesTotal,
                byOrigin: salesByOrigin.map(item => ({
                    origin: item.origin,
                    count: parseInt(item.count)
                })),
                bySegment: salesBySegment.map(item => ({
                    segment: item.segment,
                    count: parseInt(item.count)
                }))
            }
        };
    }
};
exports.SpreadsService = SpreadsService;
exports.SpreadsService = SpreadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trading_spread_range_entity_1.TradingSpreadRange)),
    __param(1, (0, typeorm_1.InjectRepository)(sales_spread_entity_1.SalesSpread)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SpreadsService);
//# sourceMappingURL=spreads.service.js.map