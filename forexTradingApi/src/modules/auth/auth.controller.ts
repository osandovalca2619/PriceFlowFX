import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Interface para tipar el request con usuario autenticado
interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    fullName: string;
    profileId: number;
    salesGroupId: number | null;
    status: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            fullName: { type: 'string', example: 'John Doe' },
            profileId: { type: 'number', example: 1 },
            salesGroupId: { type: 'number', example: 1, nullable: true },
            status: { type: 'string', example: 'activo' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'johndoe' },
        fullName: { type: 'string', example: 'John Doe' },
        profileId: { type: 'number', example: 1 },
        salesGroupId: { type: 'number', example: 1, nullable: true },
        status: { type: 'string', example: 'activo' },
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate current token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Token is valid',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'johndoe' },
            fullName: { type: 'string', example: 'John Doe' },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async validateToken(@Request() req: AuthenticatedRequest) {
    return {
      valid: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        fullName: req.user.fullName,
      }
    };
  }
}