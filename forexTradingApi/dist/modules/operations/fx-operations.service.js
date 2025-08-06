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
exports.FxOperationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fx_operation_spot_entity_1 = require("./entities/fx-operation-spot.entity");
let FxOperationsService = class FxOperationsService {
    operationRepository;
    constructor(operationRepository) {
        this.operationRepository = operationRepository;
    }
    async create(createOperationDto) {
        const operation = this.operationRepository.create({
            ...createOperationDto,
            registerDate: new Date(),
        });
        const savedOperation = await this.operationRepository.save(operation);
        return this.findOne(savedOperation.id);
    }
    async findAll(queryDto) {
        const query = this.operationRepository.createQueryBuilder('operation')
            .leftJoinAndSelect('operation.client', 'client')
            .leftJoinAndSelect('operation.user', 'user')
            .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
            .leftJoinAndSelect('operation.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('operation.origin', 'origin')
            .leftJoinAndSelect('operation.segment', 'segment')
            .leftJoinAndSelect('operation.status', 'status')
            .leftJoinAndSelect('operation.tradingFolder', 'tradingFolder')
            .leftJoinAndSelect('operation.salesFolder', 'salesFolder');
        if (queryDto?.clientId) {
            query.andWhere('operation.clientId = :clientId', { clientId: queryDto.clientId });
        }
        if (queryDto?.userId) {
            query.andWhere('operation.userId = :userId', { userId: queryDto.userId });
        }
        if (queryDto?.baseCurrencyId) {
            query.andWhere('operation.baseCurrencyId = :baseCurrencyId', { baseCurrencyId: queryDto.baseCurrencyId });
        }
        if (queryDto?.quoteCurrencyId) {
            query.andWhere('operation.quoteCurrencyId = :quoteCurrencyId', { quoteCurrencyId: queryDto.quoteCurrencyId });
        }
        if (queryDto?.operationSide) {
            query.andWhere('operation.operationSide = :operationSide', { operationSide: queryDto.operationSide });
        }
        if (queryDto?.statusId) {
            query.andWhere('operation.statusId = :statusId', { statusId: queryDto.statusId });
        }
        if (queryDto?.originId) {
            query.andWhere('operation.originId = :originId', { originId: queryDto.originId });
        }
        if (queryDto?.segmentId) {
            query.andWhere('operation.segmentId = :segmentId', { segmentId: queryDto.segmentId });
        }
        if (queryDto?.startDateFrom && queryDto?.startDateTo) {
            query.andWhere('operation.startDate BETWEEN :startDateFrom AND :startDateTo', {
                startDateFrom: queryDto.startDateFrom,
                startDateTo: queryDto.startDateTo,
            });
        }
        else if (queryDto?.startDateFrom) {
            query.andWhere('operation.startDate >= :startDateFrom', { startDateFrom: queryDto.startDateFrom });
        }
        else if (queryDto?.startDateTo) {
            query.andWhere('operation.startDate <= :startDateTo', { startDateTo: queryDto.startDateTo });
        }
        const total = await query.getCount();
        const page = queryDto?.page || 1;
        const limit = queryDto?.limit || 20;
        const skip = (page - 1) * limit;
        const data = await query
            .orderBy('operation.registerDate', 'DESC')
            .skip(skip)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            totalPages,
        };
    }
    async findPending() {
        return this.operationRepository.find({
            where: { statusId: 2 },
            relations: [
                'client',
                'user',
                'baseCurrency',
                'quoteCurrency',
                'origin',
                'segment',
                'status',
                'tradingFolder',
                'salesFolder'
            ],
            order: { registerDate: 'DESC' },
        });
    }
    async findByCurrency(currencyId) {
        return this.operationRepository.find({
            where: [
                { baseCurrencyId: currencyId },
                { quoteCurrencyId: currencyId }
            ],
            relations: [
                'client',
                'user',
                'baseCurrency',
                'quoteCurrency',
                'origin',
                'segment',
                'status'
            ],
            order: { registerDate: 'DESC' },
            take: 100,
        });
    }
    async findLatestByCurrency(currencyId, limit = 10) {
        return this.operationRepository.find({
            where: [
                { baseCurrencyId: currencyId },
                { quoteCurrencyId: currencyId }
            ],
            relations: [
                'client',
                'user',
                'baseCurrency',
                'quoteCurrency',
                'origin',
                'segment',
                'status'
            ],
            order: { registerDate: 'DESC' },
            take: limit,
        });
    }
    async findOne(id) {
        const operation = await this.operationRepository.findOne({
            where: { id },
            relations: [
                'client',
                'client.segment',
                'user',
                'baseCurrency',
                'quoteCurrency',
                'origin',
                'segment',
                'status',
                'tradingFolder',
                'salesFolder',
                'creator',
                'modifier'
            ],
        });
        if (!operation) {
            throw new common_1.NotFoundException(`FX Operation with ID ${id} not found`);
        }
        return operation;
    }
    async update(id, updateOperationDto, modifiedBy) {
        const operation = await this.findOne(id);
        if (operation.statusId === 1) {
            throw new common_1.BadRequestException('Cannot modify completed operation');
        }
        await this.operationRepository.update(id, {
            ...updateOperationDto,
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async confirm(id, modifiedBy) {
        const operation = await this.findOne(id);
        if (operation.statusId === 1) {
            throw new common_1.BadRequestException('Operation is already confirmed');
        }
        await this.operationRepository.update(id, {
            statusId: 1,
            workflowStep: 'COMPLETED',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async cancel(id, modifiedBy, reason) {
        const operation = await this.findOne(id);
        if (operation.statusId === 3) {
            throw new common_1.BadRequestException('Operation is already cancelled');
        }
        if (operation.statusId === 1) {
            throw new common_1.BadRequestException('Cannot cancel completed operation');
        }
        const updateData = {
            statusId: 3,
            workflowStep: 'CANCELLED',
            modifiedBy,
            modifiedAt: new Date(),
        };
        if (reason) {
            updateData.comments = operation.comments
                ? `${operation.comments}\n[CANCELLED]: ${reason}`
                : `[CANCELLED]: ${reason}`;
        }
        await this.operationRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        const operation = await this.findOne(id);
        if (operation.statusId === 1) {
            throw new common_1.BadRequestException('Cannot delete completed operation');
        }
        await this.operationRepository.remove(operation);
    }
    async getPositionMXByCurrency(currency) {
        const operations = await this.operationRepository
            .createQueryBuilder('operation')
            .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
            .leftJoinAndSelect('operation.quoteCurrency', 'quoteCurrency')
            .leftJoinAndSelect('operation.origin', 'origin')
            .where('baseCurrency.code = :currency OR quoteCurrency.code = :currency', { currency })
            .andWhere('operation.statusId = :statusId', { statusId: 1 })
            .getMany();
        const channelPositions = new Map();
        operations.forEach(op => {
            const channelName = op.origin?.code || 'UNKNOWN';
            if (!channelPositions.has(channelName)) {
                channelPositions.set(channelName, {
                    channel: channelName,
                    buyAmount: 0,
                    buyTotal: 0,
                    sellAmount: 0,
                    sellTotal: 0,
                    buyCount: 0,
                    sellCount: 0,
                });
            }
            const position = channelPositions.get(channelName);
            const isBuyingCurrency = (op.operationSide === 'buy' && op.baseCurrency.code === currency) ||
                (op.operationSide === 'sell' && op.quoteCurrency.code === currency);
            if (isBuyingCurrency) {
                position.buyAmount += op.amountCurrency1;
                position.buyTotal += op.amountCurrency1 * op.clientPrice;
                position.buyCount += 1;
            }
            else {
                position.sellAmount += op.amountCurrency1;
                position.sellTotal += op.amountCurrency1 * op.clientPrice;
                position.sellCount += 1;
            }
        });
        const channels = Array.from(channelPositions.values()).map(pos => ({
            channel: pos.channel,
            buyAmount: pos.buyAmount,
            buyAvgPrice: pos.buyCount > 0 ? pos.buyTotal / pos.buyAmount : 0,
            sellAmount: pos.sellAmount,
            sellAvgPrice: pos.sellCount > 0 ? pos.sellTotal / pos.sellAmount : 0,
            netPosition: pos.buyAmount - pos.sellAmount,
        }));
        return {
            currency,
            channels: channels.sort((a, b) => a.channel.localeCompare(b.channel)),
        };
    }
    async getOperationStats() {
        const [total, pending, completed, cancelled] = await Promise.all([
            this.operationRepository.count(),
            this.operationRepository.count({ where: { statusId: 2 } }),
            this.operationRepository.count({ where: { statusId: 1 } }),
            this.operationRepository.count({ where: { statusId: 3 } })
        ]);
        const [byStatus, byOperationSide] = await Promise.all([
            this.operationRepository
                .createQueryBuilder('operation')
                .select('operation.statusId', 'statusId')
                .addSelect('COUNT(*)', 'count')
                .groupBy('operation.statusId')
                .getRawMany(),
            this.operationRepository
                .createQueryBuilder('operation')
                .select('operation.operationSide', 'side')
                .addSelect('COUNT(*)', 'count')
                .groupBy('operation.operationSide')
                .getRawMany()
        ]);
        return {
            total,
            pending,
            completed,
            cancelled,
            byStatus: byStatus.map(item => ({
                statusId: parseInt(item.statusId),
                count: parseInt(item.count)
            })),
            byOperationSide: byOperationSide.map(item => ({
                side: item.side,
                count: parseInt(item.count)
            }))
        };
    }
    async getVolumeAnalysis(days = 30) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        const operations = await this.operationRepository
            .createQueryBuilder('operation')
            .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
            .leftJoinAndSelect('operation.origin', 'origin')
            .where('operation.registerDate >= :fromDate', { fromDate })
            .andWhere('operation.statusId = :statusId', { statusId: 1 })
            .getMany();
        const totalVolume = operations.reduce((sum, op) => sum + op.amountCurrency2, 0);
        const averageDailyVolume = totalVolume / days;
        const currencyVolumes = new Map();
        const channelVolumes = new Map();
        operations.forEach(op => {
            const currency = op.baseCurrency.code;
            const channel = op.origin?.code || 'UNKNOWN';
            currencyVolumes.set(currency, (currencyVolumes.get(currency) || 0) + op.amountCurrency2);
            channelVolumes.set(channel, (channelVolumes.get(channel) || 0) + op.amountCurrency2);
        });
        return {
            totalVolume,
            averageDailyVolume,
            byCurrency: Array.from(currencyVolumes.entries())
                .map(([currency, volume]) => ({ currency, volume }))
                .sort((a, b) => b.volume - a.volume),
            byChannel: Array.from(channelVolumes.entries())
                .map(([channel, volume]) => ({ channel, volume }))
                .sort((a, b) => b.volume - a.volume)
        };
    }
    async calculatePnL(operationId, marketPrice) {
        const operation = await this.findOne(operationId);
        const sign = operation.operationSide === 'buy' ? 1 : -1;
        const priceDiff = marketPrice - operation.costPrice;
        const pnl = priceDiff * operation.amountCurrency1 * sign;
        await this.operationRepository.update(operationId, {
            pnlCalculated: pnl,
            modifiedAt: new Date(),
        });
        return pnl;
    }
};
exports.FxOperationsService = FxOperationsService;
exports.FxOperationsService = FxOperationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fx_operation_spot_entity_1.FxOperationSpot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FxOperationsService);
//# sourceMappingURL=fx-operations.service.js.map