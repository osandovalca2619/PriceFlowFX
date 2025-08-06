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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_profile_entity_1 = require("./entities/user-profile.entity");
const hash_service_1 = require("../common/services/hash.service");
let UsersService = class UsersService {
    usersRepository;
    userProfileRepository;
    hashService;
    constructor(usersRepository, userProfileRepository, hashService) {
        this.usersRepository = usersRepository;
        this.userProfileRepository = userProfileRepository;
        this.hashService = hashService;
    }
    async create(createUserDto) {
        const profile = await this.userProfileRepository.findOne({
            where: { id: createUserDto.profileId }
        });
        if (!profile) {
            throw new common_1.BadRequestException(`Profile with ID ${createUserDto.profileId} not found`);
        }
        const existingUser = await this.findByUsername(createUserDto.username);
        if (existingUser) {
            throw new common_1.ConflictException('User with this username already exists');
        }
        let hashedPassword;
        if (createUserDto.password) {
            hashedPassword = await this.hashService.hashPassword(createUserDto.password);
        }
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            status: createUserDto.status || 'activo',
        });
        return this.usersRepository.save(user);
    }
    async findAll() {
        return this.usersRepository.find({
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                createdAt: true,
                modifiedAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                createdBy: true,
                createdAt: true,
                modifiedBy: true,
                modifiedAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({
            where: { username },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                createdAt: true,
                modifiedAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findByUsernameWithPassword(username) {
        return this.usersRepository.findOne({
            where: { username },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                password: true,
                createdAt: true,
                modifiedAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findByIdWithPassword(id) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                password: true,
                createdAt: true,
                modifiedAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findActiveUsers() {
        return this.usersRepository.find({
            where: { status: 'activo' },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                profileId: true,
                salesGroupId: true,
                status: true,
                createdAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findByProfileId(profileId) {
        return this.usersRepository.find({
            where: { profileId },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                status: true,
                createdAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async findBySalesGroupId(salesGroupId) {
        return this.usersRepository.find({
            where: { salesGroupId },
            relations: ['profile'],
            select: {
                id: true,
                username: true,
                fullName: true,
                status: true,
                createdAt: true,
                profile: {
                    id: true,
                    name: true,
                    description: true,
                }
            }
        });
    }
    async update(id, updateUserDto, modifiedBy) {
        const user = await this.findOne(id);
        if (updateUserDto.profileId && updateUserDto.profileId !== user.profileId) {
            const profile = await this.userProfileRepository.findOne({
                where: { id: updateUserDto.profileId }
            });
            if (!profile) {
                throw new common_1.BadRequestException(`Profile with ID ${updateUserDto.profileId} not found`);
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await this.hashService.hashPassword(updateUserDto.password);
        }
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.findByUsername(updateUserDto.username);
            if (existingUser) {
                throw new common_1.ConflictException('User with this username already exists');
            }
        }
        await this.usersRepository.update(id, {
            ...updateUserDto,
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async updatePassword(id, newPassword, modifiedBy) {
        const hashedPassword = await this.hashService.hashPassword(newPassword);
        await this.usersRepository.update(id, {
            password: hashedPassword,
            modifiedBy,
            modifiedAt: new Date(),
        });
    }
    async deactivateUser(id, modifiedBy) {
        await this.usersRepository.update(id, {
            status: 'inactivo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async activateUser(id, modifiedBy) {
        await this.usersRepository.update(id, {
            status: 'activo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async validatePassword(plainTextPassword, hashedPassword) {
        return this.hashService.comparePassword(plainTextPassword, hashedPassword);
    }
    async getAllProfiles() {
        return this.userProfileRepository.find({
            order: { name: 'ASC' }
        });
    }
    async getProfileById(id) {
        return this.userProfileRepository.findOne({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(user_profile_entity_1.UserProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        hash_service_1.HashService])
], UsersService);
//# sourceMappingURL=users.service.js.map