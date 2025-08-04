import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsernameWithPassword(username);
    
    if (!user) {
      return null;
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'activo') {
      return null;
    }

    // Verificar que tenga password (en caso de que sea opcional)
    if (!user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      const { password: _, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      username: user.username, 
      sub: user.id,
      profileId: user.profileId,
      salesGroupId: user.salesGroupId 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        profileId: user.profileId,
        salesGroupId: user.salesGroupId,
        status: user.status,
      },
    };
  }

  async validateUserById(userId: number): Promise<any> {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'activo') {
      throw new UnauthorizedException('User is inactive');
    }

    return user;
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
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
}