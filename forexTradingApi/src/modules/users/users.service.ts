import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../common/services/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService, // Inyectar HashService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username already exists
    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    let hashedPassword: string | undefined;
    
    // Hash the password if provided
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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'createdAt', 'modifiedAt'],
      // ✅ REMOVIDO: relations: ['profile', 'salesGroup'] - No existen estas relaciones
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'createdBy', 'createdAt', 'modifiedBy', 'modifiedAt'],
      // ✅ REMOVIDO: relations: ['profile', 'salesGroup'] - No existen estas relaciones
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'createdAt', 'modifiedAt'],
    });
  }

  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'password', 'createdAt', 'modifiedAt'],
    });
  }

  // ✅ MÉTODO FALTANTE - Agregado aquí
  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'password', 'createdAt', 'modifiedAt'],
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { status: 'activo' },
      select: ['id', 'username', 'fullName', 'profileId', 'salesGroupId', 'status', 'createdAt'],
    });
  }

  async findByProfileId(profileId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { profileId },
      select: ['id', 'username', 'fullName', 'status', 'createdAt'],
    });
  }

  async findBySalesGroupId(salesGroupId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { salesGroupId },
      select: ['id', 'username', 'fullName', 'status', 'createdAt'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto, modifiedBy: number): Promise<User> {
    const user = await this.findOne(id);
    
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hashPassword(updateUserDto.password);
    }

    // Check if username is being changed to one that already exists
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new ConflictException('User with this username already exists');
      }
    }

    await this.usersRepository.update(id, {
      ...updateUserDto,
      modifiedBy,
      modifiedAt: new Date(),
    });
    
    return this.findOne(id);
  }

  // ✅ MÉTODO NUEVO - Para cambio de contraseña específico
  async updatePassword(id: number, newPassword: string, modifiedBy: number): Promise<void> {
    const hashedPassword = await this.hashService.hashPassword(newPassword);
    
    await this.usersRepository.update(id, {
      password: hashedPassword,
      modifiedBy,
      modifiedAt: new Date(),
    });
  }

  async deactivateUser(id: number, modifiedBy: number): Promise<User> {
    await this.usersRepository.update(id, {
      status: 'inactivo',
      modifiedBy,
      modifiedAt: new Date(),
    });
    
    return this.findOne(id);
  }

  async activateUser(id: number, modifiedBy: number): Promise<User> {
    await this.usersRepository.update(id, {
      status: 'activo',
      modifiedBy,
      modifiedAt: new Date(),
    });
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  // ✅ MÉTODO DEPRECATED - Mantener por compatibilidad, pero usar HashService
  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return this.hashService.comparePassword(plainTextPassword, hashedPassword);
  }
}