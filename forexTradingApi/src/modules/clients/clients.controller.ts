// forexTradingApi/src/modules/clients/clients.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
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

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Client with this identifier already exists.' })
  async create(@Body() createClientDto: CreateClientDto, @Request() req: AuthenticatedRequest) {
    createClientDto.createdBy = req.user.id;
    return this.clientsService.create(createClientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all clients with optional filters and pagination' })
  @ApiQuery({ name: 'clientIdentifier', required: false, description: 'Filter by client identifier' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter by client name (partial match)' })
  @ApiQuery({ name: 'segmentId', required: false, description: 'Filter by segment ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status (activo/inactivo)' })
  @ApiQuery({ name: 'q', required: false, description: 'General search in identifier and name' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Clients retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
        page: { type: 'number' },
        totalPages: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() queryDto: QueryClientDto) {
    return this.clientsService.findAll(queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  @ApiOperation({ summary: 'Get all active clients' })
  @ApiResponse({ status: 200, description: 'Active clients retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findActive() {
    return this.clientsService.findActive();
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: 'Search clients by query string' })
  @ApiQuery({ name: 'q', description: 'Search query', required: true })
  @ApiQuery({ name: 'limit', description: 'Maximum results (default: 10)', required: false })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async searchClients(@Query('q') query: string, @Query('limit') limit?: number) {
    return this.clientsService.searchClients(query, limit ? parseInt(limit.toString()) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get client statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Client statistics retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
        inactive: { type: 'number' },
        bySegment: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              segmentId: { type: 'number' },
              count: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStats() {
    return this.clientsService.getClientStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('segment/:segmentId')
  @ApiOperation({ summary: 'Get clients by segment ID' })
  @ApiParam({ name: 'segmentId', description: 'Segment ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Clients by segment retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findBySegment(@Param('segmentId', ParseIntPipe) segmentId: number) {
    return this.clientsService.findBySegment(segmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('identifier/:identifier')
  @ApiOperation({ summary: 'Get client by identifier' })
  @ApiParam({ name: 'identifier', description: 'Client identifier', type: 'string' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async findByIdentifier(@Param('identifier') identifier: string) {
    const client = await this.clientsService.findByIdentifier(identifier);
    if (!client) {
      throw new Error(`Client with identifier ${identifier} not found`);
    }
    return client;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Client updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 409, description: 'Client identifier already exists.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.clientsService.update(id, updateClientDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Client deactivated successfully.' })
  @ApiResponse({ status: 400, description: 'Client is already inactive.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async deactivate(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.clientsService.deactivate(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Client activated successfully.' })
  @ApiResponse({ status: 400, description: 'Client is already active.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async activate(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.clientsService.activate(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete client by ID' })
  @ApiParam({ name: 'id', description: 'Client ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @ApiResponse({ status: 400, description: 'Client cannot be deleted - still in use.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.remove(id);
    return { message: 'Client deleted successfully' };
  }
}