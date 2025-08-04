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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const hash_service_1 = require("../common/services/hash.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    hashService;
    constructor(usersService, jwtService, hashService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.hashService = hashService;
    }
    async validateUser(username, password) {
        const user = await this.usersService.findByUsernameWithPassword(username);
        console.log('👤 Usuario encontrado:', !!user);
        console.log('🔐 Usuario tiene password:', !!user?.password);
        console.log('📊 Usuario status:', user?.status);
        if (!user) {
            return null;
        }
        if (user.status !== 'activo') {
            return null;
        }
        if (!user.password) {
            return null;
        }
        const isPasswordValid = await this.hashService.comparePassword(password, user.password);
        if (isPasswordValid) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async login(username, password) {
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const payload = {
            username: user.username,
            sub: user.id,
            profileId: user.profileId,
            salesGroupId: user.salesGroupId
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName,
                profileId: user.profileId,
                salesGroupId: user.salesGroupId,
                status: user.status,
            },
            expires_in: '24h',
        };
    }
    async register(createUserDto, createdBy) {
        if (createUserDto.password) {
            const passwordValidation = this.hashService.validatePasswordStrength(createUserDto.password);
            if (!passwordValidation.isValid) {
                throw new common_1.BadRequestException({
                    message: 'La contraseña no cumple con los requisitos de seguridad',
                    errors: passwordValidation.errors,
                    score: passwordValidation.score,
                });
            }
        }
        const newUser = await this.usersService.create({
            ...createUserDto,
            createdBy,
        });
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }
    async validateUserById(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        if (user.status !== 'activo') {
            throw new common_1.UnauthorizedException('Usuario inactivo');
        }
        return user;
    }
    async getProfile(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            profileId: user.profileId,
            salesGroupId: user.salesGroupId,
            status: user.status,
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersService.findByIdWithPassword(userId);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const isCurrentPasswordValid = await this.hashService.comparePassword(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Contraseña actual incorrecta');
        }
        const passwordValidation = this.hashService.validatePasswordStrength(newPassword);
        if (!passwordValidation.isValid) {
            throw new common_1.BadRequestException({
                message: 'La nueva contraseña no cumple con los requisitos de seguridad',
                errors: passwordValidation.errors,
                score: passwordValidation.score,
            });
        }
        await this.usersService.updatePassword(userId, newPassword, userId);
        return { message: 'Contraseña actualizada exitosamente' };
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        hash_service_1.HashService])
], AuthService);
//# sourceMappingURL=auth.service.js.map