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
exports.CatalogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const segment_entity_1 = require("./entities/segment.entity");
const quote_origin_entity_1 = require("./entities/quote-origin.entity");
const fx_product_entity_1 = require("./entities/fx-product.entity");
const market_scenario_entity_1 = require("./entities/market-scenario.entity");
const fx_operation_status_entity_1 = require("../operations/entities/fx-operation-status.entity");
let CatalogsService = class CatalogsService {
    segmentRepository;
    quoteOriginRepository;
    fxProductRepository;
    marketScenarioRepository;
    operationStatusRepository;
    constructor(segmentRepository, quoteOriginRepository, fxProductRepository, marketScenarioRepository, operationStatusRepository) {
        this.segmentRepository = segmentRepository;
        this.quoteOriginRepository = quoteOriginRepository;
        this.fxProductRepository = fxProductRepository;
        this.marketScenarioRepository = marketScenarioRepository;
        this.operationStatusRepository = operationStatusRepository;
    }
    async getAllSegments() {
        return this.segmentRepository.find({
            order: { name: 'ASC' }
        });
    }
    async getSegmentById(id) {
        const segment = await this.segmentRepository.findOne({ where: { id } });
        if (!segment) {
            throw new common_1.NotFoundException(`Segment with ID ${id} not found`);
        }
        return segment;
    }
    async getAllQuoteOrigins() {
        return this.quoteOriginRepository.find({
            order: { code: 'ASC' }
        });
    }
    async getActiveQuoteOrigins() {
        return this.quoteOriginRepository.find({
            where: { active: true },
            order: { code: 'ASC' }
        });
    }
    async getQuoteOriginById(id) {
        const origin = await this.quoteOriginRepository.findOne({ where: { id } });
        if (!origin) {
            throw new common_1.NotFoundException(`Quote origin with ID ${id} not found`);
        }
        return origin;
    }
    async getQuoteOriginByCode(code) {
        return this.quoteOriginRepository.findOne({
            where: { code: code.toUpperCase() }
        });
    }
    async getAllFxProducts() {
        return this.fxProductRepository.find({
            order: { code: 'ASC' }
        });
    }
    async getActiveFxProducts() {
        return this.fxProductRepository.find({
            where: { active: true },
            order: { code: 'ASC' }
        });
    }
    async getFxProductById(id) {
        const product = await this.fxProductRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException(`FX Product with ID ${id} not found`);
        }
        return product;
    }
    async getFxProductByCode(code) {
        return this.fxProductRepository.findOne({
            where: { code: code.toUpperCase() }
        });
    }
    async getAllMarketScenarios() {
        return this.marketScenarioRepository.find({
            order: { volatilityMultiplier: 'ASC' }
        });
    }
    async getActiveMarketScenarios() {
        return this.marketScenarioRepository.find({
            where: { active: true },
            order: { volatilityMultiplier: 'ASC' }
        });
    }
    async getMarketScenarioById(id) {
        const scenario = await this.marketScenarioRepository.findOne({ where: { id } });
        if (!scenario) {
            throw new common_1.NotFoundException(`Market scenario with ID ${id} not found`);
        }
        return scenario;
    }
    async getMarketScenarioByCode(code) {
        return this.marketScenarioRepository.findOne({
            where: { code: code.toUpperCase() }
        });
    }
    async getAllOperationStatuses() {
        return this.operationStatusRepository.find({
            order: { displayOrder: 'ASC' }
        });
    }
    async getOperationStatusById(id) {
        const status = await this.operationStatusRepository.findOne({ where: { id } });
        if (!status) {
            throw new common_1.NotFoundException(`Operation status with ID ${id} not found`);
        }
        return status;
    }
    async getOperationStatusByCode(code) {
        return this.operationStatusRepository.findOne({
            where: { code: code.toLowerCase() }
        });
    }
    async getAllCatalogs() {
        const [segments, quoteOrigins, fxProducts, marketScenarios, operationStatuses] = await Promise.all([
            this.getAllSegments(),
            this.getActiveQuoteOrigins(),
            this.getActiveFxProducts(),
            this.getActiveMarketScenarios(),
            this.getAllOperationStatuses(),
        ]);
        return {
            segments,
            quoteOrigins,
            fxProducts,
            marketScenarios,
            operationStatuses,
        };
    }
    async getActiveCatalogs() {
        const [segments, quoteOrigins, fxProducts, marketScenarios] = await Promise.all([
            this.getAllSegments(),
            this.getActiveQuoteOrigins(),
            this.getActiveFxProducts(),
            this.getActiveMarketScenarios(),
        ]);
        return {
            segments,
            quoteOrigins,
            fxProducts,
            marketScenarios,
        };
    }
    async validateCatalogReferences(references) {
        const validations = [];
        if (references.segmentId) {
            validations.push(this.getSegmentById(references.segmentId));
        }
        if (references.originId) {
            validations.push(this.getQuoteOriginById(references.originId));
        }
        if (references.fxProductId) {
            validations.push(this.getFxProductById(references.fxProductId));
        }
        if (references.scenarioId) {
            validations.push(this.getMarketScenarioById(references.scenarioId));
        }
        if (references.statusId) {
            validations.push(this.getOperationStatusById(references.statusId));
        }
        try {
            await Promise.all(validations);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
exports.CatalogsService = CatalogsService;
exports.CatalogsService = CatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(segment_entity_1.Segment)),
    __param(1, (0, typeorm_1.InjectRepository)(quote_origin_entity_1.QuoteOrigin)),
    __param(2, (0, typeorm_1.InjectRepository)(fx_product_entity_1.FxProduct)),
    __param(3, (0, typeorm_1.InjectRepository)(market_scenario_entity_1.MarketScenario)),
    __param(4, (0, typeorm_1.InjectRepository)(fx_operation_status_entity_1.FxOperationStatus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map