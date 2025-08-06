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
exports.UserProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const users_service_1 = require("./users.service");
let UserProfilesController = class UserProfilesController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAllProfiles() {
        return this.usersService.getAllProfiles();
    }
    async getProfileById(id) {
        const profile = await this.usersService.getProfileById(id);
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    }
    async getUsersByProfile(profileId) {
        return this.usersService.findByProfileId(profileId);
    }
};
exports.UserProfilesController = UserProfilesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user profiles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profiles retrieved successfully.',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Admin' },
                    description: { type: 'string', example: 'Administrador del sistema con acceso completo' },
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserProfilesController.prototype, "getAllProfiles", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully.',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Admin' },
                description: { type: 'string', example: 'Administrador del sistema con acceso completo' },
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Profile not found.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserProfilesController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get users by profile ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Profile ID', type: 'number' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Users by profile retrieved successfully.',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    username: { type: 'string', example: 'johndoe' },
                    fullName: { type: 'string', example: 'John Doe' },
                    status: { type: 'string', example: 'activo' },
                    createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
                    profile: {
                        type: 'object',
                        properties: {
                            id: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Admin' },
                            description: { type: 'string', example: 'Administrador del sistema' },
                        }
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserProfilesController.prototype, "getUsersByProfile", null);
exports.UserProfilesController = UserProfilesController = __decorate([
    (0, swagger_1.ApiTags)('user-profiles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('user-profiles'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserProfilesController);
//# sourceMappingURL=user-profiles.controller.js.map