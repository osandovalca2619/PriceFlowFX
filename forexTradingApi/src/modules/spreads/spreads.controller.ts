// forexTradingApi/src/modules/spreads/spreads.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { SpreadsService } from './spreads.service';
import { CreateTradingSpreadDto } from './dto/create-trading-spread.dto';
import { UpdateTradingSpreadDto } from './dto/update-trading-spread.dto';
import { CreateSalesSpreadDto } from './dto/create-sales-spread.dto';
import { UpdateSalesSpreadDto } from './dto/update-sales-spread.dto';
import { QueryTradingSpreadDto } from './dto/query-trading-spread.dto';
import { QuerySalesSpreadDto } from './dto/query-sales-spread.dto';
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

@ApiTags('spreads')
@ApiBearerAuth()
@Controller('spreads')
export class SpreadsController {
  constructor(private readonly spreadsService: SpreadsService) {}

  // =============================================
  // TRADING SPREADS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Post('trading')
  @ApiOperation({ summary: 'Create a new trading spread configuration' })
  @ApiResponse({ status: 201, description: 'Trading spread created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Amount range overlaps with existing configuration.' })
  async createTradingSpread(@Body() createSpreadDto: CreateTradingSpreadDto) {
    return this.spreadsService.createTradingSpread(createSpreadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading')
  @ApiOperation({ summary: 'Get all trading spreads with optional filters' })
  @ApiQuery({ name: 'currencyId', required: false, description: 'Filter by currency ID' })
  @ApiQuery({ name: 'scenarioId', required: false, description: 'Filter by scenario ID' })
  @ApiQuery({ name: 'currencyCode', required: false, description: 'Filter by currency code' })
  @ApiQuery({ name: 'scenarioCode', required: false, description: 'Filter by scenario code' })
  @ApiResponse({ status: 200, description: 'Trading spreads retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAllTradingSpreads(@Query() queryDto: QueryTradingSpreadDto) {
    return this.spreadsService.findAllTradingSpreads(queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading/stats')
  @ApiOperation({ summary: 'Get trading and sales spreads statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Spreads statistics retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        trading: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            byCurrency: { type: 'array', items: { type: 'object' } },
            byScenario: { type: 'array', items: { type: 'object' } }
          }
        },
        sales: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            byOrigin: { type: 'array', items: { type: 'object' } },
            bySegment: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSpreadStats() {
    return this.spreadsService.getSpreadStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading/matrix/:currencyId')
  @ApiOperation({ summary: 'Get trading spread matrix for a currency' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Trading spread matrix retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        currency: { type: 'string' },
        scenarios: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              scenarioId: { type: 'number' },
              scenarioName: { type: 'string' },
              ranges: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    amountMin: { type: 'number' },
                    amountMax: { type: 'number' },
                    spread: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'No trading spreads found for currency.' })
  async getTradingSpreadMatrix(@Param('currencyId', ParseIntPipe) currencyId: number) {
    return this.spreadsService.getTradingSpreadMatrix(currencyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading/currency/:currencyId')
  @ApiOperation({ summary: 'Get trading spreads by currency ID' })
  @ApiParam({ name: 'currencyId', description: 'Currency ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Trading spreads by currency retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findTradingSpreadsByCurrency(@Param('currencyId', ParseIntPipe) currencyId: number) {
    return this.spreadsService.findTradingSpreadsByCurrency(currencyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trading/:id')
  @ApiOperation({ summary: 'Get trading spread by ID' })
  @ApiParam({ name: 'id', description: 'Trading Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Trading spread retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Trading spread not found.' })
  async findTradingSpreadById(@Param('id', ParseIntPipe) id: number) {
    return this.spreadsService.findTradingSpreadById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('trading/:id')
  @ApiOperation({ summary: 'Update trading spread by ID' })
  @ApiParam({ name: 'id', description: 'Trading Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Trading spread updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Trading spread not found.' })
  @ApiResponse({ status: 409, description: 'Amount range overlaps with existing configuration.' })
  async updateTradingSpread(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpreadDto: UpdateTradingSpreadDto
  ) {
    return this.spreadsService.updateTradingSpread(id, updateSpreadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('trading/:id')
  @ApiOperation({ summary: 'Delete trading spread by ID' })
  @ApiParam({ name: 'id', description: 'Trading Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Trading spread deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Trading spread not found.' })
  async deleteTradingSpread(@Param('id', ParseIntPipe) id: number) {
    await this.spreadsService.deleteTradingSpread(id);
    return { message: 'Trading spread deleted successfully' };
  }

  // =============================================
  // SALES SPREADS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Post('sales')
  @ApiOperation({ summary: 'Create a new sales spread configuration' })
  @ApiResponse({ status: 201, description: 'Sales spread created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Sales spread configuration already exists for this combination.' })
  async createSalesSpread(@Body() createSpreadDto: CreateSalesSpreadDto) {
    return this.spreadsService.createSalesSpread(createSpreadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales')
  @ApiOperation({ summary: 'Get all sales spreads with optional filters' })
  @ApiQuery({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' })
  @ApiQuery({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' })
  @ApiQuery({ name: 'originId', required: false, description: 'Filter by origin ID' })
  @ApiQuery({ name: 'segmentId', required: false, description: 'Filter by segment ID' })
  @ApiQuery({ name: 'fxProductId', required: false, description: 'Filter by FX product ID' })
  @ApiQuery({ name: 'marketHours', required: false, description: 'Filter by market hours (true/false)' })
  @ApiQuery({ name: 'currencyPair', required: false, description: 'Filter by currency pair (USD/CLP)' })
  @ApiResponse({ status: 200, description: 'Sales spreads retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAllSalesSpreads(@Query() queryDto: QuerySalesSpreadDto) {
    return this.spreadsService.findAllSalesSpreads(queryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales/matrix')
  @ApiOperation({ summary: 'Get sales spread matrix' })
  @ApiQuery({ name: 'baseCurrencyId', required: false, description: 'Filter by base currency ID' })
  @ApiQuery({ name: 'quoteCurrencyId', required: false, description: 'Filter by quote currency ID' })
  @ApiQuery({ name: 'originId', required: false, description: 'Filter by origin ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Sales spread matrix retrieved successfully.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          pair: { type: 'string' },
          origin: { type: 'string' },
          segments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                segmentName: { type: 'string' },
                marketHours: {
                  type: 'object',
                  properties: {
                    buy: { type: 'number' },
                    sell: { type: 'number' }
                  }
                },
                afterHours: {
                  type: 'object',
                  properties: {
                    buy: { type: 'number' },
                    sell: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSalesSpreadMatrix(@Query() query: { baseCurrencyId?: number; quoteCurrencyId?: number; originId?: number }) {
    return this.spreadsService.getSalesSpreadMatrix(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales/origin/:originId')
  @ApiOperation({ summary: 'Get sales spreads by origin ID' })
  @ApiParam({ name: 'originId', description: 'Origin ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sales spreads by origin retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findSalesSpreadsByOrigin(@Param('originId', ParseIntPipe) originId: number) {
    return this.spreadsService.findSalesSpreadsByOrigin(originId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales/segment/:segmentId')
  @ApiOperation({ summary: 'Get sales spreads by segment ID' })
  @ApiParam({ name: 'segmentId', description: 'Segment ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sales spreads by segment retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findSalesSpreadsBySegment(@Param('segmentId', ParseIntPipe) segmentId: number) {
    return this.spreadsService.findSalesSpreadsBySegment(segmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales/:id')
  @ApiOperation({ summary: 'Get sales spread by ID' })
  @ApiParam({ name: 'id', description: 'Sales Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sales spread retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Sales spread not found.' })
  async findSalesSpreadById(@Param('id', ParseIntPipe) id: number) {
    return this.spreadsService.findSalesSpreadById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sales/:id')
  @ApiOperation({ summary: 'Update sales spread by ID' })
  @ApiParam({ name: 'id', description: 'Sales Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sales spread updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Sales spread not found.' })
  @ApiResponse({ status: 409, description: 'Sales spread configuration already exists for this combination.' })
  async updateSalesSpread(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSpreadDto: UpdateSalesSpreadDto
  ) {
    return this.spreadsService.updateSalesSpread(id, updateSpreadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sales/:id')
  @ApiOperation({ summary: 'Delete sales spread by ID' })
  @ApiParam({ name: 'id', description: 'Sales Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Sales spread deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Sales spread not found.' })
  async deleteSalesSpread(@Param('id', ParseIntPipe) id: number) {
    await this.spreadsService.deleteSalesSpread(id);
    return { message: 'Sales spread deleted successfully' };
  }

  // =============================================
  // UTILITY ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Post('calculate-applicable')
  @ApiOperation({ summary: 'Calculate applicable spreads for given parameters' })
  @ApiResponse({ 
    status: 200, 
    description: 'Applicable spreads calculated successfully.',
    schema: {
      type: 'object',
      properties: {
        tradingSpread: { type: 'number', nullable: true },
        salesSpread: {
          type: 'object',
          nullable: true,
          properties: {
            buy: { type: 'number' },
            sell: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation errors.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getApplicableSpread(@Body() params: {
    baseCurrencyId: number;
    quoteCurrencyId: number;
    originId: number;
    segmentId: number;
    fxProductId: number;
    marketHours: boolean;
    amount: number;
    scenarioId: number;
    clientId?: number;
  }) {
    return this.spreadsService.getApplicableSpread(params);
  }

  // =============================================
  // EXCEPTION SPREADS ENDPOINTS (Future Implementation)
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('exceptions')
  @ApiOperation({ summary: 'Get exception spreads (client-specific)' })
  @ApiResponse({ status: 200, description: 'Exception spreads retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 501, description: 'Not implemented yet - coming soon.' })
  async findExceptionSpreads() {
    // TODO: Implementar cuando se cree la entidad ExceptionSpread
    return { 
      message: 'Exception spreads functionality coming soon',
      data: [],
      total: 0 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('exceptions')
  @ApiOperation({ summary: 'Create exception spread (client-specific)' })
  @ApiResponse({ status: 201, description: 'Exception spread created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 501, description: 'Not implemented yet - coming soon.' })
  async createExceptionSpread(@Body() body: any) {
    // TODO: Implementar cuando se cree la entidad ExceptionSpread
    return { 
      message: 'Exception spreads functionality coming soon',
      data: body
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('exceptions/:id')
  @ApiOperation({ summary: 'Update exception spread by ID' })
  @ApiParam({ name: 'id', description: 'Exception Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Exception spread updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 501, description: 'Not implemented yet - coming soon.' })
  async updateExceptionSpread(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    // TODO: Implementar cuando se cree la entidad ExceptionSpread
    return { 
      message: 'Exception spreads functionality coming soon',
      id,
      data: body
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('exceptions/:id')
  @ApiOperation({ summary: 'Delete exception spread by ID' })
  @ApiParam({ name: 'id', description: 'Exception Spread ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Exception spread deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 501, description: 'Not implemented yet - coming soon.' })
  async deleteExceptionSpread(@Param('id', ParseIntPipe) id: number) {
    // TODO: Implementar cuando se cree la entidad ExceptionSpread
    return { 
      message: 'Exception spreads functionality coming soon - spread not deleted',
      id
    };
  }
}