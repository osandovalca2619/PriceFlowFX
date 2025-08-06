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
exports.ClientsController = void 0;
const common_1 = require("@nestjs/common");
const clients_service_1 = require("./clients.service");
const create_client_dto_1 = require("./dto/create-client.dto");
const update_client_dto_1 = require("./dto/update-client.dto");
const query_client_dto_1 = require("./dto/query-client.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    async create(createClientDto, req) {
        createClientDto.createdBy = req.user.id;
        return this.clientsService.create(createClientDto);
    }
    async findAll(queryDto) {
        return this.clientsService.findAll(queryDto);
    }
    async findActive() {
        return this.clientsService.findActive();
    }
    async searchClients(query, limit) {
        return this.clientsService.searchClients(query, limit ? parseInt(limit.toString()) : 10);
    }
    async getStats() {
        return this.clientsService.getClientStats();
    }
    async findBySegment(segmentId) {
        return this.clientsService.findBySegment(segmentId);
    }
    async findByIdentifier(identifier) {
        const client = await this.clientsService.findByIdentifier(identifier);
        if (!client) {
            throw new Error(`Client with identifier ${identifier} not found`);
        }
        return client;
    }
    async findOne(id) {
        return this.clientsService.findOne(id);
    }
    async update(id, updateClientDto, req) {
        return this.clientsService.update(id, updateClientDto, req.user.id);
    }
    async deactivate(id, req) {
        return this.clientsService.deactivate(id, req.user.id);
    }
    async activate(id, req) {
        return this.clientsService.activate(id, req.user.id);
    }
    async remove(id) {
        await this.clientsService.remove(id);
        return { message: 'Client deleted successfully' };
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new client' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Client created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Client with this identifier already exists.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all clients with optional filters and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'clientIdentifier', required: false, description: 'Filter by client identifier' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Filter by client name (partial match)' }),
    (0, swagger_1.ApiQuery)({ name: 'segmentId', required: false, description: 'Filter by segment ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (activo/inactivo)' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'General search in identifier and name' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Page number (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Items per page (default: 20)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Clients retrieved successfully.',
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
    __metadata("design:paramtypes", [query_client_dto_1.QueryClientDto]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active clients' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active clients retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findActive", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search clients by query string' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Search query', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Maximum results (default: 10)', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "searchClients", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Client statistics retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number' },
                active: { type: 'number' },
                inactive: { type: 'number' },
                bySegment: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            segmentId: { type: 'number' },
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
], ClientsController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('segment/:segmentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get clients by segment ID' }),
    (0, swagger_1.ApiParam)({ name: 'segmentId', description: 'Segment ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clients by segment retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('segmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findBySegment", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('identifier/:identifier'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client by identifier' }),
    (0, swagger_1.ApiParam)({ name: 'identifier', description: 'Client identifier', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    __param(0, (0, common_1.Param)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findByIdentifier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Client ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update client by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Client ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Client identifier already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_client_dto_1.UpdateClientDto, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate client by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Client ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client deactivated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Client is already inactive.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "deactivate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate client by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Client ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client activated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Client is already active.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "activate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete client by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Client ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Client not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Client cannot be deleted - still in use.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClientsController.prototype, "remove", null);
exports.ClientsController = ClientsController = __decorate([
    (0, swagger_1.ApiTags)('clients'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clients'),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map