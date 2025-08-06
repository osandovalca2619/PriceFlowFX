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
exports.SpreadsController = void 0;
const common_1 = require("@nestjs/common");
const spreads_service_1 = require("./spreads.service");
const create_trading_spread_dto_1 = require("./dto/create-trading-spread.dto");
const update_trading_spread_dto_1 = require("./dto/update-trading-spread.dto");
const create_sales_spread_dto_1 = require("./dto/create-sales-spread.dto");
const update_sales_spread_dto_1 = require("./dto/update-sales-spread.dto");
const query_trading_spread_dto_1 = require("./dto/query-trading-spread.dto");
const query_sales_spread_dto_1 = require("./dto/query-sales-spread.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let SpreadsController = class SpreadsController {
    spreadsService;
    constructor(spreadsService) {
        this.spreadsService = spreadsService;
    }
    async createTradingSpread(createSpreadDto) {
        return this.spreadsService.createTradingSpread(createSpreadDto);
    }
    async findAllTradingSpreads(queryDto) {
        return this.spreadsService.findAllTradingSpreads(queryDto);
    }
    async getSpreadStats() {
        return this.spreadsService.getSpreadStats();
    }
    async getTradingSpreadMatrix(currencyId) {
        return this.spreadsService.getTradingSpreadMatrix(currencyId);
    }
    async findTradingSpreadsByCurrency(currencyId) {
        return this.spreadsService.findTradingSpreadsByCurrency(currencyId);
    }
    async findTradingSpreadById(id) {
        return this.spreadsService.findTradingSpreadById(id);
    }
    async updateTradingSpread(id, updateSpreadDto) {
        return this.spreadsService.updateTradingSpread(id, updateSpreadDto);
    }
    async deleteTradingSpread(id) {
        await this.spreadsService.deleteTradingSpread(id);
        return { message: 'Trading spread deleted successfully' };
    }
    async createSalesSpread(createSpreadDto) {
        return this.spreadsService.createSalesSpread(createSpreadDto);
    }
    async findAllSalesSpreads(queryDto) {
        return this.spreadsService.findAllSalesSpreads(queryDto);
    }
    async getSalesSpreadMatrix(query) {
        return this.spreadsService.getSalesSpreadMatrix(query);
    }
    async findSalesSpreadsByOrigin(originId) {
        return this.spreadsService.findSalesSpreadsByOrigin(originId);
    }
    async findSalesSpreadsBySegment(segmentId) {
        return this.spreadsService.findSalesSpreadsBySegment(segmentId);
    }
    async findSalesSpreadById(id) {
        return this.spreadsService.findSalesSpreadById(id);
    }
    async updateSalesSpread(id, updateSpreadDto) {
        return this.spreadsService.updateSalesSpread(id, updateSpreadDto);
    }
    async deleteSalesSpread(id) {
        await this.spreadsService.deleteSalesSpread(id);
        return { message: 'Sales spread deleted successfully' };
    }
    async getApplicableSpread(params) {
        return this.spreadsService.getApplicableSpread(params);
    }
    async findExceptionSpreads() {
        return {
            message: 'Exception spreads functionality coming soon',
            data: [],
            total: 0
        };
    }
    async createExceptionSpread(body) {
        return {
            message: 'Exception spreads functionality coming soon',
            data: body
        };
    }
    async updateExceptionSpread(id, body) {
        return {
            message: 'Exception spreads functionality coming soon',
            id,
            data: body
        };
    }
    async deleteExceptionSpread(id) {
        return {
            message: 'Exception spreads functionality coming soon - spread not deleted',
            id
        };
    }
};
exports.SpreadsController = SpreadsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('trading'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new trading spread configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Trading spread created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Amount range overlaps with existing configuration.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_trading_spread_dto_1.CreateTradingSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "createTradingSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all trading spreads with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'currencyId', required: false, description: 'Filter by currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'scenarioId', required: false, description: 'Filter by scenario ID' }),
    (0, swagger_1.ApiQuery)({ name: 'currencyCode', required: false, description: 'Filter by currency code' }),
    (0, swagger_1.ApiQuery)({ name: 'scenarioCode', required: false, description: 'Filter by scenario code' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading spreads retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_trading_spread_dto_1.QueryTradingSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findAllTradingSpreads", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trading and sales spreads statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Spreads statistics retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                trading: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        byCurrency: { type: 'array', items: { type: 'object' } },
                        byScenario: { type: 'array', items: { type: 'object' } }
                    }
                },
                sales: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        byOrigin: { type: 'array', items: { type: 'object' } },
                        bySegment: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "getSpreadStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading/matrix/:currencyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trading spread matrix for a currency' }),
    (0, swagger_1.ApiParam)({ name: 'currencyId', description: 'Currency ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trading spread matrix retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                currency: { type: 'string' },
                scenarios: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            scenarioId: { type: 'number' },
                            scenarioName: { type: 'string' },
                            ranges: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        amountMin: { type: 'number' },
                                        amountMax: { type: 'number' },
                                        spread: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No trading spreads found for currency.' }),
    __param(0, (0, common_1.Param)('currencyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "getTradingSpreadMatrix", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading/currency/:currencyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trading spreads by currency ID' }),
    (0, swagger_1.ApiParam)({ name: 'currencyId', description: 'Currency ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading spreads by currency retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('currencyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findTradingSpreadsByCurrency", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get trading spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trading Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading spread retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trading spread not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findTradingSpreadById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('trading/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update trading spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trading Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading spread updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trading spread not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Amount range overlaps with existing configuration.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_trading_spread_dto_1.UpdateTradingSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "updateTradingSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('trading/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete trading spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Trading Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading spread deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Trading spread not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "deleteTradingSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new sales spread configuration' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Sales spread created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Sales spread configuration already exists for this combination.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sales_spread_dto_1.CreateSalesSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "createSalesSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sales spreads with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'originId', required: false, description: 'Filter by origin ID' }),
    (0, swagger_1.ApiQuery)({ name: 'segmentId', required: false, description: 'Filter by segment ID' }),
    (0, swagger_1.ApiQuery)({ name: 'fxProductId', required: false, description: 'Filter by FX product ID' }),
    (0, swagger_1.ApiQuery)({ name: 'marketHours', required: false, description: 'Filter by market hours (true/false)' }),
    (0, swagger_1.ApiQuery)({ name: 'currencyPair', required: false, description: 'Filter by currency pair (USD/CLP)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spreads retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_sales_spread_dto_1.QuerySalesSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findAllSalesSpreads", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales/matrix'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales spread matrix' }),
    (0, swagger_1.ApiQuery)({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'originId', required: false, description: 'Filter by origin ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sales spread matrix retrieved successfully.',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    pair: { type: 'string' },
                    origin: { type: 'string' },
                    segments: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                segmentName: { type: 'string' },
                                marketHours: {
                                    type: 'object',
                                    properties: {
                                        buy: { type: 'number' },
                                        sell: { type: 'number' }
                                    }
                                },
                                afterHours: {
                                    type: 'object',
                                    properties: {
                                        buy: { type: 'number' },
                                        sell: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "getSalesSpreadMatrix", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales/origin/:originId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales spreads by origin ID' }),
    (0, swagger_1.ApiParam)({ name: 'originId', description: 'Origin ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spreads by origin retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('originId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findSalesSpreadsByOrigin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales/segment/:segmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales spreads by segment ID' }),
    (0, swagger_1.ApiParam)({ name: 'segmentId', description: 'Segment ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spreads by segment retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('segmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findSalesSpreadsBySegment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get sales spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sales Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spread retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sales spread not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findSalesSpreadById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update sales spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sales Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spread updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sales spread not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Sales spread configuration already exists for this combination.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_sales_spread_dto_1.UpdateSalesSpreadDto]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "updateSalesSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete sales spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Sales Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales spread deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Sales spread not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "deleteSalesSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('calculate-applicable'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate applicable spreads for given parameters' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Applicable spreads calculated successfully.',
        schema: {
            type: 'object',
            properties: {
                tradingSpread: { type: 'number', nullable: true },
                salesSpread: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        buy: { type: 'number' },
                        sell: { type: 'number' }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "getApplicableSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exception spreads (client-specific)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception spreads retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not implemented yet - coming soon.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "findExceptionSpreads", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('exceptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Create exception spread (client-specific)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Exception spread created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not implemented yet - coming soon.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "createExceptionSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('exceptions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update exception spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exception Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception spread updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not implemented yet - coming soon.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "updateExceptionSpread", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('exceptions/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete exception spread by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Exception Spread ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exception spread deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not implemented yet - coming soon.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpreadsController.prototype, "deleteExceptionSpread", null);
exports.SpreadsController = SpreadsController = __decorate([
    (0, swagger_1.ApiTags)('spreads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('spreads'),
    __metadata("design:paramtypes", [spreads_service_1.SpreadsService])
], SpreadsController);
//# sourceMappingURL=spreads.controller.js.map