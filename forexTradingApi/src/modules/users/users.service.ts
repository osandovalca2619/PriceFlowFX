// forexTradingApi/src/modules/users/users.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../common/services/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar que el perfil existe
    const profile = await this.userProfileRepository.findOne({
      where: { id: createUserDto.profileId }
    });

    if (!profile) {
      throw new BadRequestException(`Profile with ID ${createUserDto.profileId} not found`);
    }

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
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { username },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ 
      where: { id },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findActiveUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { status: 'activo' },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findByProfileId(profileId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { profileId },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async findBySalesGroupId(salesGroupId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: { salesGroupId },
      relations: ['profile'], // ✅ AGREGADO: Incluir relación con perfil
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

  async update(id: number, updateUserDto: UpdateUserDto, modifiedBy: number): Promise<User> {
    const user = await this.findOne(id);
    
    // Verificar nuevo perfil si se está cambiando
    if (updateUserDto.profileId && updateUserDto.profileId !== user.profileId) {
      const profile = await this.userProfileRepository.findOne({
        where: { id: updateUserDto.profileId }
      });
      if (!profile) {
        throw new BadRequestException(`Profile with ID ${updateUserDto.profileId} not found`);
      }
    }
    
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

  async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return this.hashService.comparePassword(plainTextPassword, hashedPassword);
  }

  // ✅ NUEVOS MÉTODOS PARA PERFILES
  async getAllProfiles(): Promise<UserProfile[]> {
    return this.userProfileRepository.find({
      order: { name: 'ASC' }
    });
  }

  async getProfileById(id: number): Promise<UserProfile | null> {
    return this.userProfileRepository.findOne({ where: { id } });
  }
}