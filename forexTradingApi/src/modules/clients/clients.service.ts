// forexTradingApi/src/modules/clients/clients.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, SelectQueryBuilder } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    // Verificar que el identificador no exista
    const existingClient = await this.findByIdentifier(createClientDto.clientIdentifier);
    if (existingClient) {
      throw new ConflictException(`Client with identifier ${createClientDto.clientIdentifier} already exists`);
    }

    // TODO: Verificar que el segmentId existe
    // const segment = await this.segmentRepository.findOne({ where: { id: createClientDto.segmentId } });
    // if (!segment) {
    //   throw new BadRequestException(`Segment with ID ${createClientDto.segmentId} not found`);
    // }

    const client = this.clientRepository.create(createClientDto);
    return this.clientRepository.save(client);
  }

  async findAll(queryDto?: QueryClientDto): Promise<{ data: Client[]; total: number; page: number; totalPages: number }> {
    const query = this.clientRepository.createQueryBuilder('client')
      .leftJoinAndSelect('client.segment', 'segment')
      .leftJoinAndSelect('client.creator', 'creator')
      .leftJoinAndSelect('client.modifier', 'modifier');

    // Aplicar filtros
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

    // Búsqueda general (q) busca en identifier y name
    if (queryDto?.q) {
      query.andWhere(
        '(client.clientIdentifier ILIKE :search OR client.name ILIKE :search)',
        { search: `%${queryDto.q}%` }
      );
    }

    // Contar total antes de aplicar paginación
    const total = await query.getCount();

    // Aplicar paginación
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

  async findActive(): Promise<Client[]> {
    return this.clientRepository.find({
      where: { status: 'activo' },
      relations: ['segment'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['segment', 'creator', 'modifier']
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async findByIdentifier(clientIdentifier: string): Promise<Client | null> {
    return this.clientRepository.findOne({
      where: { clientIdentifier },
      relations: ['segment', 'creator', 'modifier']
    });
  }

  async searchClients(query: string, limit: number = 10): Promise<Client[]> {
    return this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.segment', 'segment')
      .where('client.status = :status', { status: 'activo' })
      .andWhere(
        '(client.clientIdentifier ILIKE :search OR client.name ILIKE :search)',
        { search: `%${query}%` }
      )
      .orderBy('client.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  async findBySegment(segmentId: number): Promise<Client[]> {
    return this.clientRepository.find({
      where: { segmentId, status: 'activo' },
      relations: ['segment'],
      order: { name: 'ASC' }
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto, modifiedBy: number): Promise<Client> {
    const client = await this.findOne(id);

    // Si se está cambiando el identificador, verificar que no exista
    if (updateClientDto.clientIdentifier && updateClientDto.clientIdentifier !== client.clientIdentifier) {
      const existingClient = await this.findByIdentifier(updateClientDto.clientIdentifier);
      if (existingClient) {
        throw new ConflictException(`Client with identifier ${updateClientDto.clientIdentifier} already exists`);
      }
    }

    // TODO: Si se está cambiando el segmento, verificar que existe
    // if (updateClientDto.segmentId && updateClientDto.segmentId !== client.segmentId) {
    //   const segment = await this.segmentRepository.findOne({ where: { id: updateClientDto.segmentId } });
    //   if (!segment) {
    //     throw new BadRequestException(`Segment with ID ${updateClientDto.segmentId} not found`);
    //   }
    // }

    await this.clientRepository.update(id, {
      ...updateClientDto,
      modifiedBy,
      modifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async deactivate(id: number, modifiedBy: number): Promise<Client> {
    const client = await this.findOne(id);

    if (client.status === 'inactivo') {
      throw new BadRequestException('Client is already inactive');
    }

    await this.clientRepository.update(id, {
      status: 'inactivo',
      modifiedBy,
      modifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async activate(id: number, modifiedBy: number): Promise<Client> {
    const client = await this.findOne(id);

    if (client.status === 'activo') {
      throw new BadRequestException('Client is already active');
    }

    await this.clientRepository.update(id, {
      status: 'activo',
      modifiedBy,
      modifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    
    // TODO: Verificar que no esté siendo usado en operaciones
    // const operationsCount = await this.operationRepository.count({ where: { clientId: id } });
    // if (operationsCount > 0) {
    //   throw new BadRequestException('Cannot delete client with existing operations');
    // }
    
    await this.clientRepository.remove(client);
  }

  // Métodos de utilidad para el frontend
  async getClientStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    bySegment: { segmentId: number; count: number }[];
  }> {
    const [total, active, inactive] = await Promise.all([
      this.clientRepository.count(),
      this.clientRepository.count({ where: { status: 'activo' } }),
      this.clientRepository.count({ where: { status: 'inactivo' } })
    ]);

    // Contar por segmento
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
}