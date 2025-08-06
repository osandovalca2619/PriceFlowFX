// forexTradingApi/src/modules/users/user-profiles.controller.ts
import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('user-profiles')
@ApiBearerAuth()
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all user profiles' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profiles retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Admin' },
          description: { type: 'string', example: 'Administrador del sistema con acceso completo' },
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllProfiles() {
    return this.usersService.getAllProfiles();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({ name: 'id', description: 'Profile ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'User profile retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Admin' },
        description: { type: 'string', example: 'Administrador del sistema con acceso completo' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async getProfileById(@Param('id', ParseIntPipe) id: number) {
    const profile = await this.usersService.getProfileById(id);
    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/users')
  @ApiOperation({ summary: 'Get users by profile ID' })
  @ApiParam({ name: 'id', description: 'Profile ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users by profile retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          username: { type: 'string', example: 'johndoe' },
          fullName: { type: 'string', example: 'John Doe' },
          status: { type: 'string', example: 'activo' },
          createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          profile: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Admin' },
              description: { type: 'string', example: 'Administrador del sistema' },
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUsersByProfile(@Param('id', ParseIntPipe) profileId: number) {
    return this.usersService.findByProfileId(profileId);
  }
}