// forexTradingApi/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/services/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  profileId: number;
  profileName: string; // ✅ AGREGADO: Nombre del perfil
  salesGroupId: number | null;
  status: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
  expires_in: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  /**
   * Valida las credenciales del usuario
   */
  async validateUser(username: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByUsernameWithPassword(username);
    
    console.log('👤 Usuario encontrado:', !!user);
    console.log('🔐 Usuario tiene password:', !!user?.password);
    console.log('📊 Usuario status:', user?.status);
    
    if (!user) {
      return null;
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'activo') {
      return null;
    }

    // Verificar que tenga password
    if (!user.password) {
      return null;
    }

    // Comparar contraseña
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);
    
    if (isPasswordValid) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        profileName: user.profile?.name || 'Unknown Profile' // ✅ AGREGADO: Nombre del perfil
      } as AuthUser;
    }
    
    return null;
  }

  /**
   * Proceso de login
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      username: user.username, 
      sub: user.id,
      profileId: user.profileId,
      profileName: user.profileName, // ✅ AGREGADO: Incluir en JWT
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
        profileName: user.profileName, // ✅ AGREGADO: Nombre del perfil
        salesGroupId: user.salesGroupId,
        status: user.status,
      },
      expires_in: '24h',
    };
  }

  /**
   * Registro de nuevo usuario
   */
  async register(createUserDto: CreateUserDto, createdBy: number): Promise<AuthUser> {
    // Validar fortaleza de contraseña
    if (createUserDto.password) {
      const passwordValidation = this.hashService.validatePasswordStrength(createUserDto.password);
      
      if (!passwordValidation.isValid) {
        throw new BadRequestException({
          message: 'La contraseña no cumple con los requisitos de seguridad',
          errors: passwordValidation.errors,
          score: passwordValidation.score,
        });
      }
    }

    // Crear usuario (el hash se hace en el UsersService)
    const newUser = await this.usersService.create({
      ...createUserDto,
      createdBy,
    });

    // Obtener el usuario con el perfil para retornar el nombre
    const userWithProfile = await this.usersService.findOne(newUser.id);

    return {
      ...userWithProfile,
      profileName: userWithProfile.profile?.name || 'Unknown Profile'
    } as AuthUser;
  }

  /**
   * Validar usuario por ID (para JWT strategy)
   */
  async validateUserById(userId: number): Promise<AuthUser> {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'activo') {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      ...user,
      profileName: user.profile?.name || 'Unknown Profile' // ✅ AGREGADO: Nombre del perfil
    } as AuthUser;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(userId: number): Promise<AuthUser> {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      profileId: user.profileId,
      profileName: user.profile?.name || 'Unknown Profile', // ✅ AGREGADO: Nombre del perfil
      salesGroupId: user.salesGroupId,
      status: user.status,
    };
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    userId: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByIdWithPassword(userId);
    
    if (!user || !user.password) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await this.hashService.comparePassword(
      currentPassword, 
      user.password
    );
    
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Contraseña actual incorrecta');
    }

    // Validar nueva contraseña
    const passwordValidation = this.hashService.validatePasswordStrength(newPassword);
    
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'La nueva contraseña no cumple con los requisitos de seguridad',
        errors: passwordValidation.errors,
        score: passwordValidation.score,
      });
    }

    // Actualizar contraseña
    await this.usersService.updatePassword(userId, newPassword, userId);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  /**
   * Verificar si un token JWT es válido
   */
  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}