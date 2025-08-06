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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_entity_1 = require("./entities/client.entity");
let ClientsService = class ClientsService {
    clientRepository;
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async create(createClientDto) {
        const existingClient = await this.findByIdentifier(createClientDto.clientIdentifier);
        if (existingClient) {
            throw new common_1.ConflictException(`Client with identifier ${createClientDto.clientIdentifier} already exists`);
        }
        const client = this.clientRepository.create(createClientDto);
        return this.clientRepository.save(client);
    }
    async findAll(queryDto) {
        const query = this.clientRepository.createQueryBuilder('client')
            .leftJoinAndSelect('client.segment', 'segment')
            .leftJoinAndSelect('client.creator', 'creator')
            .leftJoinAndSelect('client.modifier', 'modifier');
        if (queryDto?.clientIdentifier) {
            query.andWhere('client.clientIdentifier ILIKE :identifier', {
                identifier: `%${queryDto.clientIdentifier}%`
            });
        }
        if (queryDto?.name) {
            query.andWhere('client.name ILIKE :name', { name: `%${queryDto.name}%` });
        }
        if (queryDto?.segmentId) {
            query.andWhere('client.segmentId = :segmentId', { segmentId: queryDto.segmentId });
        }
        if (queryDto?.status) {
            query.andWhere('client.status = :status', { status: queryDto.status });
        }
        if (queryDto?.q) {
            query.andWhere('(client.clientIdentifier ILIKE :search OR client.name ILIKE :search)', { search: `%${queryDto.q}%` });
        }
        const total = await query.getCount();
        const page = queryDto?.page || 1;
        const limit = queryDto?.limit || 20;
        const skip = (page - 1) * limit;
        const data = await query
            .orderBy('client.name', 'ASC')
            .skip(skip)
            .take(limit)
            .getMany();
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            totalPages
        };
    }
    async findActive() {
        return this.clientRepository.find({
            where: { status: 'activo' },
            relations: ['segment'],
            order: { name: 'ASC' }
        });
    }
    async findOne(id) {
        const client = await this.clientRepository.findOne({
            where: { id },
            relations: ['segment', 'creator', 'modifier']
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client with ID ${id} not found`);
        }
        return client;
    }
    async findByIdentifier(clientIdentifier) {
        return this.clientRepository.findOne({
            where: { clientIdentifier },
            relations: ['segment', 'creator', 'modifier']
        });
    }
    async searchClients(query, limit = 10) {
        return this.clientRepository
            .createQueryBuilder('client')
            .leftJoinAndSelect('client.segment', 'segment')
            .where('client.status = :status', { status: 'activo' })
            .andWhere('(client.clientIdentifier ILIKE :search OR client.name ILIKE :search)', { search: `%${query}%` })
            .orderBy('client.name', 'ASC')
            .limit(limit)
            .getMany();
    }
    async findBySegment(segmentId) {
        return this.clientRepository.find({
            where: { segmentId, status: 'activo' },
            relations: ['segment'],
            order: { name: 'ASC' }
        });
    }
    async update(id, updateClientDto, modifiedBy) {
        const client = await this.findOne(id);
        if (updateClientDto.clientIdentifier && updateClientDto.clientIdentifier !== client.clientIdentifier) {
            const existingClient = await this.findByIdentifier(updateClientDto.clientIdentifier);
            if (existingClient) {
                throw new common_1.ConflictException(`Client with identifier ${updateClientDto.clientIdentifier} already exists`);
            }
        }
        await this.clientRepository.update(id, {
            ...updateClientDto,
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async deactivate(id, modifiedBy) {
        const client = await this.findOne(id);
        if (client.status === 'inactivo') {
            throw new common_1.BadRequestException('Client is already inactive');
        }
        await this.clientRepository.update(id, {
            status: 'inactivo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async activate(id, modifiedBy) {
        const client = await this.findOne(id);
        if (client.status === 'activo') {
            throw new common_1.BadRequestException('Client is already active');
        }
        await this.clientRepository.update(id, {
            status: 'activo',
            modifiedBy,
            modifiedAt: new Date(),
        });
        return this.findOne(id);
    }
    async remove(id) {
        const client = await this.findOne(id);
        await this.clientRepository.remove(client);
    }
    async getClientStats() {
        const [total, active, inactive] = await Promise.all([
            this.clientRepository.count(),
            this.clientRepository.count({ where: { status: 'activo' } }),
            this.clientRepository.count({ where: { status: 'inactivo' } })
        ]);
        const bySegment = await this.clientRepository
            .createQueryBuilder('client')
            .select('client.segmentId', 'segmentId')
            .addSelect('COUNT(*)', 'count')
            .where('client.status = :status', { status: 'activo' })
            .groupBy('client.segmentId')
            .getRawMany();
        return {
            total,
            active,
            inactive,
            bySegment: bySegment.map(item => ({
                segmentId: parseInt(item.segmentId),
                count: parseInt(item.count)
            }))
        };
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClientsService);
//# sourceMappingURL=clients.service.js.map