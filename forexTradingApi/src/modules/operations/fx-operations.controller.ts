// forexTradingApi/src/modules/operations/fx-operations.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { FxOperationsService } from './fx-operations.service';
import { CreateFxOperationSpotDto } from './dto/create-fx-operation-spot.dto';
import { UpdateFxOperationSpotDto } from './dto/update-fx-operation-spot.dto';
import { QueryFxOperationSpotDto } from './dto/query-fx-operation-spot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

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

@ApiTags('fx-operations')
@ApiBearerAuth()
@Controller('fx-operations')
export class FxOperationsController {
  constructor(private readonly operationsService: FxOperationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new FX spot operation' })
  @ApiResponse({ status: 201, description: 'FX operation created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(@Body() createOperationDto: CreateFxOperationSpotDto, @Request() req: AuthenticatedRequest) {
    createOperationDto.createdBy = req.user.id;
    return this.operationsService.create(createOperationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all FX operations with optional filters and pagination' })
  @ApiQuery({ name: 'clientId', required: false, description: 'Filter by client ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' })
  @ApiQuery({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' })
  @ApiQuery({ name: 'operationSide', required: false, description: 'Filter by operation side (buy/sell)' })
  @ApiQuery({ name: 'statusId', required: false, description: 'Filter by status ID' })
  @ApiQuery({ name: 'startDateFrom', required: false, description: 'Filter from start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'startDateTo', required: false, description: 'Filter to start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ 
    status: 200, 
    description: 'FX operations retrieved successfully.',
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
  async findAll(@Query() queryDto: QueryFxOperationSpotDto) {
    return this.operationsService.findAll(queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  @ApiOperation({ summary: 'Get all pending FX operations' })
  @ApiResponse({ status: 200, description: 'Pending FX operations retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findPending() {
    return this.operationsService.findPending();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get FX operations statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Operations statistics retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        pending: { type: 'number' },
        completed: { type: 'number' },
        cancelled: { type: 'number' },
        byStatus: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              statusId: { type: 'number' },
              count: { type: 'number' }
            }
          }
        },
        byOperationSide: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              side: { type: 'string' },
              count: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStats() {
    return this.operationsService.getOperationStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('volume-analysis')
  @ApiOperation({ summary: 'Get volume analysis for FX operations' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days to analyze (default: 30)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Volume analysis retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        totalVolume: { type: 'number' },
        averageDailyVolume: { type: 'number' },
        byCurrency: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              currency: { type: 'string' },
              volume: { type: 'number' }
            }
          }
        },
        byChannel: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channel: { type: 'string' },
              volume: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getVolumeAnalysis(@Query('days') days?: number) {
    return this.operationsService.getVolumeAnalysis(days ? parseInt(days.toString()) : 30);
  }

  @UseGuards(JwtAuthGuard)
  @Get('position-mx/:currency')
  @ApiOperation({ summary: 'Get position MX for a specific currency' })
  @ApiParam({ name: 'currency', description: 'Currency code (e.g., USD, EUR)', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Position MX retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        currency: { type: 'string' },
        channels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channel: { type: 'string' },
              buyAmount: { type: 'number' },
              buyAvgPrice: { type: 'number' },
              sellAmount: { type: 'number' },
              sellAvgPrice: { type: 'number' },
              netPosition: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPositionMX(@Param('currency') currency: string) {
    return this.operationsService.getPositionMXByCurrency(currency.toUpperCase());
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-currency/:currencyId')
  @ApiOperation({ summary: 'Get FX operations by currency ID' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX operations by currency retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findByCurrency(@Param('currencyId', ParseIntPipe) currencyId: number) {
    return this.operationsService.findByCurrency(currencyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('latest-by-currency/:currencyId')
  @ApiOperation({ summary: 'Get latest FX operations by currency ID' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID', type: 'number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of operations to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Latest FX operations by currency retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findLatestByCurrency(@Param('currencyId', ParseIntPipe) currencyId: number, @Query('limit') limit?: number) {
    return this.operationsService.findLatestByCurrency(currencyId, limit ? parseInt(limit.toString()) : 10);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get FX operation by ID' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX operation retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.operationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update FX operation by ID' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX operation updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors or business rules.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOperationDto: UpdateFxOperationSpotDto,
    @Request() req: AuthenticatedRequest
  ) {
    return this.operationsService.update(id, updateOperationDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm FX operation by ID' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX operation confirmed successfully.' })
  @ApiResponse({ status: 400, description: 'Operation cannot be confirmed or is already confirmed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  async confirm(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.operationsService.confirm(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel FX operation by ID' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        reason: { type: 'string', description: 'Cancellation reason' }
      }
    },
    required: false
  })
  @ApiResponse({ status: 200, description: 'FX operation cancelled successfully.' })
  @ApiResponse({ status: 400, description: 'Operation cannot be cancelled or is already cancelled.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  async cancel(
    @Param('id', ParseIntPipe) id: number, 
    @Request() req: AuthenticatedRequest,
    @Body() body?: { reason?: string }
  ) {
    return this.operationsService.cancel(id, req.user.id, body?.reason);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/calculate-pnl')
  @ApiOperation({ summary: 'Calculate PnL for FX operation' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        marketPrice: { type: 'number', description: 'Current market price' }
      },
      required: ['marketPrice']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'PnL calculated successfully.',
    schema: {
      type: 'object',
      properties: {
        pnl: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  async calculatePnL(@Param('id', ParseIntPipe) id: number, @Body() body: { marketPrice: number }) {
    const pnl = await this.operationsService.calculatePnL(id, body.marketPrice);
    return { pnl };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete FX operation by ID' })
  @ApiParam({ name: 'id', description: 'Operation ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX operation deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX operation not found.' })
  @ApiResponse({ status: 400, description: 'Operation cannot be deleted.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.operationsService.remove(id);
    return { message: 'FX operation deleted successfully' };
  }
}