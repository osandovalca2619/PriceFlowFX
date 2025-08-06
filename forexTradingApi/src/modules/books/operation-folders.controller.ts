// forexTradingApi/src/modules/books/operation-folders.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { OperationFoldersService } from './operation-folders.service';
import { CreateOperationFolderDto } from './dto/create-operation-folder.dto';
import { UpdateOperationFolderDto } from './dto/update-operation-folder.dto';
import { QueryOperationFolderDto } from './dto/query-operation-folder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

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

@ApiTags('operation-folders')
@ApiBearerAuth()
@Controller('operation-folders')
export class OperationFoldersController {
  constructor(private readonly foldersService: OperationFoldersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new operation folder' })
  @ApiResponse({ status: 201, description: 'Operation folder created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Folder with this code already exists.' })
  async create(@Body() createFolderDto: CreateOperationFolderDto, @Request() req: AuthenticatedRequest) {
    createFolderDto.createdBy = req.user.id;
    return this.foldersService.create(createFolderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all operation folders with optional filters' })
  @ApiQuery({ name: 'folderType', required: false, description: 'Filter by folder type' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (activo/inactivo)' })
  @ApiQuery({ name: 'code', required: false, description: 'Filter by code (partial match)' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by name (partial match)' })
  @ApiResponse({ status: 200, description: 'Operation folders retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() queryDto: QueryOperationFolderDto) {
    return this.foldersService.findAll(queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  @ApiOperation({ summary: 'Get all active operation folders' })
  @ApiResponse({ status: 200, description: 'Active operation folders retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findActive() {
    return this.foldersService.findActive();
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading')
  @ApiOperation({ summary: 'Get all trading folders' })
  @ApiResponse({ status: 200, description: 'Trading folders retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findTradingFolders() {
    return this.foldersService.findTradingFolders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales')
  @ApiOperation({ summary: 'Get all sales folders' })
  @ApiResponse({ status: 200, description: 'Sales folders retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findSalesFolders() {
    return this.foldersService.findSalesFolders();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get operation folder statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Folder statistics retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        byType: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              count: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStats() {
    return this.foldersService.getFolderStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('code/:code')
  @ApiOperation({ summary: 'Get operation folder by code' })
  @ApiParam({ name: 'code', description: 'Folder code', type: 'string' })
  @ApiResponse({ status: 200, description: 'Operation folder retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  async findByCode(@Param('code') code: string) {
    const folder = await this.foldersService.findByCode(code);
    if (!folder) {
      throw new Error(`Operation folder with code ${code} not found`);
    }
    return folder;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get operation folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation folder retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.foldersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update operation folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation folder updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  @ApiResponse({ status: 409, description: 'Folder code already exists.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFolderDto: UpdateOperationFolderDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.foldersService.update(id, updateFolderDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate operation folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation folder deactivated successfully.' })
  @ApiResponse({ status: 400, description: 'Folder is already inactive.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  async deactivate(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.foldersService.deactivate(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate operation folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation folder activated successfully.' })
  @ApiResponse({ status: 400, description: 'Folder is already active.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  async activate(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.foldersService.activate(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete operation folder by ID' })
  @ApiParam({ name: 'id', description: 'Folder ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation folder deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation folder not found.' })
  @ApiResponse({ status: 400, description: 'Folder cannot be deleted - still in use.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.foldersService.remove(id);
    return { message: 'Operation folder deleted successfully' };
  }
}