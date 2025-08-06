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
exports.FxOperationsController = void 0;
const common_1 = require("@nestjs/common");
const fx_operations_service_1 = require("./fx-operations.service");
const create_fx_operation_spot_dto_1 = require("./dto/create-fx-operation-spot.dto");
const update_fx_operation_spot_dto_1 = require("./dto/update-fx-operation-spot.dto");
const query_fx_operation_spot_dto_1 = require("./dto/query-fx-operation-spot.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let FxOperationsController = class FxOperationsController {
    operationsService;
    constructor(operationsService) {
        this.operationsService = operationsService;
    }
    async create(createOperationDto, req) {
        createOperationDto.createdBy = req.user.id;
        return this.operationsService.create(createOperationDto);
    }
    async findAll(queryDto) {
        return this.operationsService.findAll(queryDto);
    }
    async findPending() {
        return this.operationsService.findPending();
    }
    async getStats() {
        return this.operationsService.getOperationStats();
    }
    async getVolumeAnalysis(days) {
        return this.operationsService.getVolumeAnalysis(days ? parseInt(days.toString()) : 30);
    }
    async getPositionMX(currency) {
        return this.operationsService.getPositionMXByCurrency(currency.toUpperCase());
    }
    async findByCurrency(currencyId) {
        return this.operationsService.findByCurrency(currencyId);
    }
    async findLatestByCurrency(currencyId, limit) {
        return this.operationsService.findLatestByCurrency(currencyId, limit ? parseInt(limit.toString()) : 10);
    }
    async findOne(id) {
        return this.operationsService.findOne(id);
    }
    async update(id, updateOperationDto, req) {
        return this.operationsService.update(id, updateOperationDto, req.user.id);
    }
    async confirm(id, req) {
        return this.operationsService.confirm(id, req.user.id);
    }
    async cancel(id, req, body) {
        return this.operationsService.cancel(id, req.user.id, body?.reason);
    }
    async calculatePnL(id, body) {
        const pnl = await this.operationsService.calculatePnL(id, body.marketPrice);
        return { pnl };
    }
    async remove(id) {
        await this.operationsService.remove(id);
        return { message: 'FX operation deleted successfully' };
    }
};
exports.FxOperationsController = FxOperationsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new FX spot operation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'FX operation created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fx_operation_spot_dto_1.CreateFxOperationSpotDto, Object]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all FX operations with optional filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'clientId', required: false, description: 'Filter by client ID' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'Filter by user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' }),
    (0, swagger_1.ApiQuery)({ name: 'operationSide', required: false, description: 'Filter by operation side (buy/sell)' }),
    (0, swagger_1.ApiQuery)({ name: 'statusId', required: false, description: 'Filter by status ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDateFrom', required: false, description: 'Filter from start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'startDateTo', required: false, description: 'Filter to start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 20)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'FX operations retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                data: { type: 'array', items: { type: 'object' } },
                total: { type: 'number' },
                page: { type: 'number' },
                totalPages: { type: 'number' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_fx_operation_spot_dto_1.QueryFxOperationSpotDto]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('pending'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pending FX operations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending FX operations retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "findPending", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FX operations statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Operations statistics retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number' },
                pending: { type: 'number' },
                completed: { type: 'number' },
                cancelled: { type: 'number' },
                byStatus: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            statusId: { type: 'number' },
                            count: { type: 'number' }
                        }
                    }
                },
                byOperationSide: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            side: { type: 'string' },
                            count: { type: 'number' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('volume-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get volume analysis for FX operations' }),
    (0, swagger_1.ApiQuery)({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Volume analysis retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                totalVolume: { type: 'number' },
                averageDailyVolume: { type: 'number' },
                byCurrency: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            currency: { type: 'string' },
                            volume: { type: 'number' }
                        }
                    }
                },
                byChannel: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            channel: { type: 'string' },
                            volume: { type: 'number' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "getVolumeAnalysis", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('position-mx/:currency'),
    (0, swagger_1.ApiOperation)({ summary: 'Get position MX for a specific currency' }),
    (0, swagger_1.ApiParam)({ name: 'currency', description: 'Currency code (e.g., USD, EUR)', type: 'string' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Position MX retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                currency: { type: 'string' },
                channels: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            channel: { type: 'string' },
                            buyAmount: { type: 'number' },
                            buyAvgPrice: { type: 'number' },
                            sellAmount: { type: 'number' },
                            sellAvgPrice: { type: 'number' },
                            netPosition: { type: 'number' }
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('currency')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "getPositionMX", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('by-currency/:currencyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FX operations by currency ID' }),
    (0, swagger_1.ApiParam)({ name: 'currencyId', description: 'Currency ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operations by currency retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('currencyId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "findByCurrency", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('latest-by-currency/:currencyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest FX operations by currency ID' }),
    (0, swagger_1.ApiParam)({ name: 'currencyId', description: 'Currency ID', type: 'number' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of operations to return (default: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest FX operations by currency retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('currencyId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "findLatestByCurrency", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get FX operation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operation retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update FX operation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operation updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors or business rules.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_fx_operation_spot_dto_1.UpdateFxOperationSpotDto, Object]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm FX operation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operation confirmed successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Operation cannot be confirmed or is already confirmed.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "confirm", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel FX operation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                reason: { type: 'string', description: 'Cancellation reason' }
            }
        },
        required: false
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operation cancelled successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Operation cannot be cancelled or is already cancelled.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "cancel", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/calculate-pnl'),
    (0, swagger_1.ApiOperation)({ summary: 'Calculate PnL for FX operation' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                marketPrice: { type: 'number', description: 'Current market price' }
            },
            required: ['marketPrice']
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'PnL calculated successfully.',
        schema: {
            type: 'object',
            properties: {
                pnl: { type: 'number' }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "calculatePnL", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete FX operation by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Operation ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'FX operation deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'FX operation not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Operation cannot be deleted.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FxOperationsController.prototype, "remove", null);
exports.FxOperationsController = FxOperationsController = __decorate([
    (0, swagger_1.ApiTags)('fx-operations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('fx-operations'),
    __metadata("design:paramtypes", [fx_operations_service_1.FxOperationsService])
], FxOperationsController);
//# sourceMappingURL=fx-operations.controller.js.map