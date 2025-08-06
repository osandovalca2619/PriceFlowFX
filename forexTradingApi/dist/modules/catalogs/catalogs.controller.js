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
exports.CatalogsController = void 0;
const common_1 = require("@nestjs/common");
const catalogs_service_1 = require("./catalogs.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let CatalogsController = class CatalogsController {
    catalogsService;
    constructor(catalogsService) {
        this.catalogsService = catalogsService;
    }
    async getAllCatalogs() {
        return this.catalogsService.getAllCatalogs();
    }
    async getActiveCatalogs() {
        return this.catalogsService.getActiveCatalogs();
    }
    async getAllSegments() {
        return this.catalogsService.getAllSegments();
    }
    async getSegmentById(id) {
        return this.catalogsService.getSegmentById(id);
    }
    async getAllQuoteOrigins() {
        return this.catalogsService.getAllQuoteOrigins();
    }
    async getActiveQuoteOrigins() {
        return this.catalogsService.getActiveQuoteOrigins();
    }
    async getQuoteOriginById(id) {
        return this.catalogsService.getQuoteOriginById(id);
    }
    async getQuoteOriginByCode(code) {
        const origin = await this.catalogsService.getQuoteOriginByCode(code);
        if (!origin) {
            throw new Error(`Quote origin with code ${code} not found`);
        }
        return origin;
    }
    async getAllFxProducts() {
        return this.catalogsService.getAllFxProducts();
    }
    async getActiveFxProducts() {
        return this.catalogsService.getActiveFxProducts();
    }
    async getFxProductById(id) {
        return this.catalogsService.getFxProductById(id);
    }
    async getAllMarketScenarios() {
        return this.catalogsService.getAllMarketScenarios();
    }
    async getActiveMarketScenarios() {
        return this.catalogsService.getActiveMarketScenarios();
    }
    async getMarketScenarioById(id) {
        return this.catalogsService.getMarketScenarioById(id);
    }
    async getAllOperationStatuses() {
        return this.catalogsService.getAllOperationStatuses();
    }
    async getOperationStatusById(id) {
        return this.catalogsService.getOperationStatusById(id);
    }
};
exports.CatalogsController = CatalogsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all catalogs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All catalogs retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                segments: { type: 'array', items: { type: 'object' } },
                quoteOrigins: { type: 'array', items: { type: 'object' } },
                fxProducts: { type: 'array', items: { type: 'object' } },
                marketScenarios: { type: 'array', items: { type: 'object' } },
                operationStatuses: { type: 'array', items: { type: 'object' } }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllCatalogs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active catalogs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active catalogs retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                segments: { type: 'array', items: { type: 'object' } },
                quoteOrigins: { type: 'array', items: { type: 'object' } },
                fxProducts: { type: 'array', items: { type: 'object' } },
                marketScenarios: { type: 'array', items: { type: 'object' } }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getActiveCatalogs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('segments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all segments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Segments retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllSegments", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('segments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get segment by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Segment ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Segment retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Segment not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getSegmentById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('quote-origins'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all quote origins (channels)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quote origins retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllQuoteOrigins", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('quote-origins/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active quote origins' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active quote origins retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getActiveQuoteOrigins", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('quote-origins/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quote origin by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Quote Origin ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quote origin retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quote origin not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getQuoteOriginById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('quote-origins/code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quote origin by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Quote Origin code', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Quote origin retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quote origin not found.' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getQuoteOriginByCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fx-products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all FX products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX products retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllFxProducts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fx-products/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active FX products' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active FX products retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getActiveFxProducts", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('fx-products/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FX product by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'FX Product ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX product retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX product not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getFxProductById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('market-scenarios'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all market scenarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Market scenarios retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllMarketScenarios", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('market-scenarios/active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active market scenarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active market scenarios retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getActiveMarketScenarios", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('market-scenarios/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get market scenario by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Market Scenario ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Market scenario retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Market scenario not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getMarketScenarioById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('operation-statuses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all operation statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation statuses retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getAllOperationStatuses", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('operation-statuses/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operation status by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation Status ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation status retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation status not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CatalogsController.prototype, "getOperationStatusById", null);
exports.CatalogsController = CatalogsController = __decorate([
    (0, swagger_1.ApiTags)('catalogs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalogs_service_1.CatalogsService])
], CatalogsController);
//# sourceMappingURL=catalogs.controller.js.map