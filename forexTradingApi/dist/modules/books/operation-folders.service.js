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
exports.OperationFoldersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const operation_folder_entity_1 = require("./entities/operation-folder.entity");
let OperationFoldersService = class OperationFoldersService {
    folderRepository;
    constructor(folderRepository) {
        this.folderRepository = folderRepository;
    }
    async create(createFolderDto) {
        const existingFolder = await this.findByCode(createFolderDto.code);
        if (existingFolder) {
            throw new common_1.ConflictException(`Folder with code ${createFolderDto.code} already exists`);
        }
        const folder = this.folderRepository.create({
            ...createFolderDto,
            code: createFolderDto.code.toUpperCase(),
        });
        return this.folderRepository.save(folder);
    }
    async findAll(queryDto) {
        const query = this.folderRepository.createQueryBuilder('folder')
            .leftJoinAndSelect('folder.creator', 'creator')
            .leftJoinAndSelect('folder.modifier', 'modifier');
        if (queryDto?.folderType) {
            query.andWhere('folder.folderType = :folderType', { folderType: queryDto.folderType });
        }
        if (queryDto?.status) {
            query.andWhere('folder.status = :status', { status: queryDto.status });
        }
        if (queryDto?.code) {
            query.andWhere('folder.code ILIKE :code', { code: `%${queryDto.code}%` });
        }
        if (queryDto?.name) {
            query.andWhere('folder.name ILIKE :name', { name: `%${queryDto.name}%` });
        }
        return query
            .orderBy('folder.folderType', 'ASC')
            .addOrderBy('folder.code', 'ASC')
            .getMany();
    }
    async findActive() {
        return this.folderRepository.find({
            where: { status: 'activo' },
            order: { folderType: 'ASC', code: 'ASC' },
            relations: ['creator']
        });
    }
    async findByType(folderType) {
        return this.folderRepository.find({
            where: { folderType, status: 'activo' },
            order: { code: 'ASC' },
            relations: ['creator']
        });
    }
    async findTradingFolders() {
        return this.findByType(operation_folder_entity_1.FolderType.TRADING);
    }
    async findSalesFolders() {
        return this.findByType(operation_folder_entity_1.FolderType.SALES);
    }
    async findOne(id) {
        const folder = await this.folderRepository.findOne({
            where: { id },
            relations: ['creator', 'modifier']
        });
        if (!folder) {
            throw new common_1.NotFoundException(`Operation folder with ID ${id} not found`);
        }
        return folder;
    }
    async findByCode(code) {
        return this.folderRepository.findOne({
            where: { code: code.toUpperCase() },
            relations: ['creator', 'modifier']
        });
    }
    async update(id, updateFolderDto, modifiedBy) {
        const folder = await this.findOne(id);
        if (updateFolderDto.code && updateFolderDto.code !== folder.code) {
            const existingFolder = await this.findByCode(updateFolderDto.code);
            if (existingFolder) {
                throw new common_1.ConflictException(`Folder with code ${updateFolderDto.code} already exists`);
            }
        }
        const updateData = {
            ...updateFolderDto,
            modifiedBy,
            modifiedAt: new Date(),
        };
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }
        await this.folderRepository.update(id, updateData);
        return this.findOne(id);
    }
    async deactivate(id, modifiedBy) {
        const folder = await this.findOne(id);
        if (folder.status === 'inactivo') {
            throw new common_1.BadRequestException('Folder is already inactive');
        }
        await this.folderRepository.update(id, {
            status: 'inactivo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async activate(id, modifiedBy) {
        const folder = await this.findOne(id);
        if (folder.status === 'activo') {
            throw new common_1.BadRequestException('Folder is already active');
        }
        await this.folderRepository.update(id, {
            status: 'activo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async remove(id) {
        const folder = await this.findOne(id);
        await this.folderRepository.remove(folder);
    }
    async getFolderStats() {
        const [total, active, inactive] = await Promise.all([
            this.folderRepository.count(),
            this.folderRepository.count({ where: { status: 'activo' } }),
            this.folderRepository.count({ where: { status: 'inactivo' } })
        ]);
        const byType = await this.folderRepository
            .createQueryBuilder('folder')
            .select('folder.folderType', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('folder.status = :status', { status: 'activo' })
            .groupBy('folder.folderType')
            .getRawMany();
        return {
            total,
            active,
            inactive,
            byType: byType.map(item => ({
                type: item.type,
                count: parseInt(item.count)
            }))
        };
    }
};
exports.OperationFoldersService = OperationFoldersService;
exports.OperationFoldersService = OperationFoldersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(operation_folder_entity_1.OperationFolder)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OperationFoldersService);
//# sourceMappingURL=operation-folders.service.js.map