import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

// Interface para tipar el request con usuario autenticado
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    username: string;
    fullName: string;
    profileId: number;
    salesGroupId: number | null;
    status: string;
  };
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'User with this username already exists.' })
  create(@Body() createUserDto: CreateUserDto, @Request() req: AuthenticatedRequest) {
    // El usuario autenticado será quien crea el registro
    createUserDto.createdBy = req.user.id;
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  @ApiOperation({ summary: 'Get all active users' })
  @ApiResponse({ status: 200, description: 'Active users retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:profileId')
  @ApiOperation({ summary: 'Get users by profile ID' })
  @ApiParam({ name: 'profileId', description: 'Profile ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Users by profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByProfileId(@Param('profileId', ParseIntPipe) profileId: number) {
    return this.usersService.findByProfileId(profileId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales-group/:salesGroupId')
  @ApiOperation({ summary: 'Get users by sales group ID' })
  @ApiParam({ name: 'salesGroupId', description: 'Sales Group ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Users by sales group retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findBySalesGroupId(@Param('salesGroupId', ParseIntPipe) salesGroupId: number) {
    return this.usersService.findBySalesGroupId(salesGroupId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: AuthenticatedRequest
  ) {
    // El usuario autenticado será quien modifica el registro
    return this.usersService.update(id, updateUserDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deactivateUser(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.usersService.deactivateUser(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User activated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  activateUser(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.usersService.activateUser(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}