// forexTradingApi/src/modules/books/operation-folders.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperationFolder, FolderType } from './entities/operation-folder.entity';
import { CreateOperationFolderDto } from './dto/create-operation-folder.dto';
import { UpdateOperationFolderDto } from './dto/update-operation-folder.dto';
import { QueryOperationFolderDto } from './dto/query-operation-folder.dto';

@Injectable()
export class OperationFoldersService {
  constructor(
    @InjectRepository(OperationFolder)
    private folderRepository: Repository<OperationFolder>,
  ) {}

  async create(createFolderDto: CreateOperationFolderDto): Promise<OperationFolder> {
    // Verificar que el código no exista
    const existingFolder = await this.findByCode(createFolderDto.code);
    if (existingFolder) {
      throw new ConflictException(`Folder with code ${createFolderDto.code} already exists`);
    }

    const folder = this.folderRepository.create({
      ...createFolderDto,
      code: createFolderDto.code.toUpperCase(),
    });

    return this.folderRepository.save(folder);
  }

  async findAll(queryDto?: QueryOperationFolderDto): Promise<OperationFolder[]> {
    const query = this.folderRepository.createQueryBuilder('folder')
      .leftJoinAndSelect('folder.creator', 'creator')
      .leftJoinAndSelect('folder.modifier', 'modifier');

    // Aplicar filtros
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

  async findActive(): Promise<OperationFolder[]> {
    return this.folderRepository.find({
      where: { status: 'activo' },
      order: { folderType: 'ASC', code: 'ASC' },
      relations: ['creator']
    });
  }

  async findByType(folderType: FolderType): Promise<OperationFolder[]> {
    return this.folderRepository.find({
      where: { folderType, status: 'activo' },
      order: { code: 'ASC' },
      relations: ['creator']
    });
  }

  async findTradingFolders(): Promise<OperationFolder[]> {
    return this.findByType(FolderType.TRADING);
  }

  async findSalesFolders(): Promise<OperationFolder[]> {
    return this.findByType(FolderType.SALES);
  }

  async findOne(id: number): Promise<OperationFolder> {
    const folder = await this.folderRepository.findOne({
      where: { id },
      relations: ['creator', 'modifier']
    });

    if (!folder) {
      throw new NotFoundException(`Operation folder with ID ${id} not found`);
    }

    return folder;
  }

  async findByCode(code: string): Promise<OperationFolder | null> {
    return this.folderRepository.findOne({
      where: { code: code.toUpperCase() },
      relations: ['creator', 'modifier']
    });
  }

  async update(id: number, updateFolderDto: UpdateOperationFolderDto, modifiedBy: number): Promise<OperationFolder> {
    const folder = await this.findOne(id);

    // Si se está cambiando el código, verificar que no exista
    if (updateFolderDto.code && updateFolderDto.code !== folder.code) {
      const existingFolder = await this.findByCode(updateFolderDto.code);
      if (existingFolder) {
        throw new ConflictException(`Folder with code ${updateFolderDto.code} already exists`);
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

  async deactivate(id: number, modifiedBy: number): Promise<OperationFolder> {
    const folder = await this.findOne(id);

    if (folder.status === 'inactivo') {
      throw new BadRequestException('Folder is already inactive');
    }

    await this.folderRepository.update(id, {
      status: 'inactivo',
      modifiedBy,
      modifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async activate(id: number, modifiedBy: number): Promise<OperationFolder> {
    const folder = await this.findOne(id);

    if (folder.status === 'activo') {
      throw new BadRequestException('Folder is already active');
    }

    await this.folderRepository.update(id, {
      status: 'activo',
      modifiedBy,
      modifiedAt: new Date(),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const folder = await this.findOne(id);
    
    // TODO: Verificar que no esté siendo usado en operaciones
    // const operationsCount = await this.operationRepository.count({
    //   where: [
    //     { tradingFolderId: id },
    //     { salesFolderId: id }
    //   ]
    // });
    // if (operationsCount > 0) {
    //   throw new BadRequestException('Cannot delete folder with existing operations');
    // }
    
    await this.folderRepository.remove(folder);
  }

  // Métodos de utilidad
  async getFolderStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byType: { type: string; count: number }[];
  }> {
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
}