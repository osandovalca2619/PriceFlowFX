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
exports.OperationFoldersController = void 0;
const common_1 = require("@nestjs/common");
const operation_folders_service_1 = require("./operation-folders.service");
const create_operation_folder_dto_1 = require("./dto/create-operation-folder.dto");
const update_operation_folder_dto_1 = require("./dto/update-operation-folder.dto");
const query_operation_folder_dto_1 = require("./dto/query-operation-folder.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let OperationFoldersController = class OperationFoldersController {
    foldersService;
    constructor(foldersService) {
        this.foldersService = foldersService;
    }
    async create(createFolderDto, req) {
        createFolderDto.createdBy = req.user.id;
        return this.foldersService.create(createFolderDto);
    }
    async findAll(queryDto) {
        return this.foldersService.findAll(queryDto);
    }
    async findActive() {
        return this.foldersService.findActive();
    }
    async findTradingFolders() {
        return this.foldersService.findTradingFolders();
    }
    async findSalesFolders() {
        return this.foldersService.findSalesFolders();
    }
    async getStats() {
        return this.foldersService.getFolderStats();
    }
    async findByCode(code) {
        const folder = await this.foldersService.findByCode(code);
        if (!folder) {
            throw new Error(`Operation folder with code ${code} not found`);
        }
        return folder;
    }
    async findOne(id) {
        return this.foldersService.findOne(id);
    }
    async update(id, updateFolderDto, req) {
        return this.foldersService.update(id, updateFolderDto, req.user.id);
    }
    async deactivate(id, req) {
        return this.foldersService.deactivate(id, req.user.id);
    }
    async activate(id, req) {
        return this.foldersService.activate(id, req.user.id);
    }
    async remove(id) {
        await this.foldersService.remove(id);
        return { message: 'Operation folder deleted successfully' };
    }
};
exports.OperationFoldersController = OperationFoldersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new operation folder' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Operation folder created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Folder with this code already exists.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_operation_folder_dto_1.CreateOperationFolderDto, Object]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all operation folders with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'folderType', required: false, description: 'Filter by folder type' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filter by status (activo/inactivo)' }),
    (0, swagger_1.ApiQuery)({ name: 'code', required: false, description: 'Filter by code (partial match)' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: false, description: 'Filter by name (partial match)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folders retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_operation_folder_dto_1.QueryOperationFolderDto]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active operation folders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active operation folders retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findActive", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('trading'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all trading folders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trading folders retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findTradingFolders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all sales folders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sales folders retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findSalesFolders", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operation folder statistics' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Folder statistics retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number' },
                active: { type: 'number' },
                inactive: { type: 'number' },
                byType: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string' },
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
], OperationFoldersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operation folder by code' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Folder code', type: 'string' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findByCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get operation folder by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Folder ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder retrieved successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update operation folder by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Folder ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation errors.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Folder code already exists.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_operation_folder_dto_1.UpdateOperationFolderDto, Object]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate operation folder by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Folder ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder deactivated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Folder is already inactive.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "deactivate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate operation folder by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Folder ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder activated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Folder is already active.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "activate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete operation folder by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Folder ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Operation folder deleted successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Operation folder not found.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Folder cannot be deleted - still in use.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OperationFoldersController.prototype, "remove", null);
exports.OperationFoldersController = OperationFoldersController = __decorate([
    (0, swagger_1.ApiTags)('operation-folders'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('operation-folders'),
    __metadata("design:paramtypes", [operation_folders_service_1.OperationFoldersService])
], OperationFoldersController);
//# sourceMappingURL=operation-folders.controller.js.map