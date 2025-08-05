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
exports.CurrenciesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const currencies_service_1 = require("./currencies.service");
const create_currency_dto_1 = require("./dto/create-currency.dto");
const update_currency_dto_1 = require("./dto/update-currency.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CurrenciesController = class CurrenciesController {
    currenciesService;
    constructor(currenciesService) {
        this.currenciesService = currenciesService;
    }
    create(createCurrencyDto) {
        return this.currenciesService.create(createCurrencyDto);
    }
    findAll() {
        return this.currenciesService.findAll();
    }
    findActive() {
        return this.currenciesService.findActive();
    }
    getStats() {
        return this.currenciesService.getStats();
    }
    findOne(id) {
        return this.currenciesService.findOne(id);
    }
    findByCode(code) {
        return this.currenciesService.findByCode(code);
    }
    update(id, updateCurrencyDto) {
        return this.currenciesService.update(id, updateCurrencyDto);
    }
    deactivate(id, body) {
        return this.currenciesService.deactivate(id, body.modifiedBy);
    }
    activate(id, body) {
        return this.currenciesService.activate(id, body.modifiedBy);
    }
    remove(id) {
        return this.currenciesService.remove(id);
    }
};
exports.CurrenciesController = CurrenciesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new currency',
        description: 'Creates a new currency in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Currency created successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Currency with this code already exists'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_currency_dto_1.CreateCurrencyDto]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all currencies',
        description: 'Retrieves a list of all currencies in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of currencies retrieved successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get active currencies',
        description: 'Retrieves a list of all active currencies'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of active currencies retrieved successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get currency statistics',
        description: 'Retrieves statistics about currencies in the system'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency statistics retrieved successfully'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get currency by ID',
        description: 'Retrieves a specific currency by its ID'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Currency ID',
        type: 'integer'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency found successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get currency by code',
        description: 'Retrieves a specific currency by its code (e.g., USD, EUR)'
    }),
    (0, swagger_1.ApiParam)({
        name: 'code',
        description: 'Currency code (3 characters)',
        example: 'USD'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency found successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update currency',
        description: 'Updates an existing currency'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Currency ID',
        type: 'integer'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency updated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Currency code already exists'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_currency_dto_1.UpdateCurrencyDto]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Deactivate currency',
        description: 'Deactivates a currency (sets status to inactive)'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Currency ID',
        type: 'integer'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency deactivated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Activate currency',
        description: 'Activates a currency (sets status to active)'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Currency ID',
        type: 'integer'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency activated successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "activate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete currency',
        description: 'Permanently deletes a currency from the system'
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Currency ID',
        type: 'integer'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Currency deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Currency not found'
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CurrenciesController.prototype, "remove", null);
exports.CurrenciesController = CurrenciesController = __decorate([
    (0, swagger_1.ApiTags)('currencies'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('currencies'),
    __metadata("design:paramtypes", [currencies_service_1.CurrenciesService])
], CurrenciesController);
//# sourceMappingURL=currencies.controller.js.map