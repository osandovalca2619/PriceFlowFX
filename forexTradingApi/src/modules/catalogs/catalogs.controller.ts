// forexTradingApi/src/modules/catalogs/catalogs.controller.ts
import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('catalogs')
@ApiBearerAuth()
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({ 
    status: 200, 
    description: 'All catalogs retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        segments: { type: 'array', items: { type: 'object' } },
        quoteOrigins: { type: 'array', items: { type: 'object' } },
        fxProducts: { type: 'array', items: { type: 'object' } },
        marketScenarios: { type: 'array', items: { type: 'object' } },
        operationStatuses: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllCatalogs() {
    return this.catalogsService.getAllCatalogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  @ApiOperation({ summary: 'Get all active catalogs' })
  @ApiResponse({ 
    status: 200, 
    description: 'Active catalogs retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        segments: { type: 'array', items: { type: 'object' } },
        quoteOrigins: { type: 'array', items: { type: 'object' } },
        fxProducts: { type: 'array', items: { type: 'object' } },
        marketScenarios: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getActiveCatalogs() {
    return this.catalogsService.getActiveCatalogs();
  }

  // =============================================
  // SEGMENTS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('segments')
  @ApiOperation({ summary: 'Get all segments' })
  @ApiResponse({ status: 200, description: 'Segments retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllSegments() {
    return this.catalogsService.getAllSegments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('segments/:id')
  @ApiOperation({ summary: 'Get segment by ID' })
  @ApiParam({ name: 'id', description: 'Segment ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Segment retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Segment not found.' })
  async getSegmentById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.getSegmentById(id);
  }

  // =============================================
  // QUOTE ORIGINS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('quote-origins')
  @ApiOperation({ summary: 'Get all quote origins (channels)' })
  @ApiResponse({ status: 200, description: 'Quote origins retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllQuoteOrigins() {
    return this.catalogsService.getAllQuoteOrigins();
  }

  @UseGuards(JwtAuthGuard)
  @Get('quote-origins/active')
  @ApiOperation({ summary: 'Get all active quote origins' })
  @ApiResponse({ status: 200, description: 'Active quote origins retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getActiveQuoteOrigins() {
    return this.catalogsService.getActiveQuoteOrigins();
  }

  @UseGuards(JwtAuthGuard)
  @Get('quote-origins/:id')
  @ApiOperation({ summary: 'Get quote origin by ID' })
  @ApiParam({ name: 'id', description: 'Quote Origin ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Quote origin retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quote origin not found.' })
  async getQuoteOriginById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.getQuoteOriginById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('quote-origins/code/:code')
  @ApiOperation({ summary: 'Get quote origin by code' })
  @ApiParam({ name: 'code', description: 'Quote Origin code', type: 'string' })
  @ApiResponse({ status: 200, description: 'Quote origin retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Quote origin not found.' })
  async getQuoteOriginByCode(@Param('code') code: string) {
    const origin = await this.catalogsService.getQuoteOriginByCode(code);
    if (!origin) {
      throw new Error(`Quote origin with code ${code} not found`);
    }
    return origin;
  }

  // =============================================
  // FX PRODUCTS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('fx-products')
  @ApiOperation({ summary: 'Get all FX products' })
  @ApiResponse({ status: 200, description: 'FX products retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllFxProducts() {
    return this.catalogsService.getAllFxProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('fx-products/active')
  @ApiOperation({ summary: 'Get all active FX products' })
  @ApiResponse({ status: 200, description: 'Active FX products retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getActiveFxProducts() {
    return this.catalogsService.getActiveFxProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Get('fx-products/:id')
  @ApiOperation({ summary: 'Get FX product by ID' })
  @ApiParam({ name: 'id', description: 'FX Product ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'FX product retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'FX product not found.' })
  async getFxProductById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.getFxProductById(id);
  }

  // =============================================
  // MARKET SCENARIOS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('market-scenarios')
  @ApiOperation({ summary: 'Get all market scenarios' })
  @ApiResponse({ status: 200, description: 'Market scenarios retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllMarketScenarios() {
    return this.catalogsService.getAllMarketScenarios();
  }

  @UseGuards(JwtAuthGuard)
  @Get('market-scenarios/active')
  @ApiOperation({ summary: 'Get all active market scenarios' })
  @ApiResponse({ status: 200, description: 'Active market scenarios retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getActiveMarketScenarios() {
    return this.catalogsService.getActiveMarketScenarios();
  }

  @UseGuards(JwtAuthGuard)
  @Get('market-scenarios/:id')
  @ApiOperation({ summary: 'Get market scenario by ID' })
  @ApiParam({ name: 'id', description: 'Market Scenario ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Market scenario retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Market scenario not found.' })
  async getMarketScenarioById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.getMarketScenarioById(id);
  }

  // =============================================
  // OPERATION STATUS ENDPOINTS
  // =============================================
  @UseGuards(JwtAuthGuard)
  @Get('operation-statuses')
  @ApiOperation({ summary: 'Get all operation statuses' })
  @ApiResponse({ status: 200, description: 'Operation statuses retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllOperationStatuses() {
    return this.catalogsService.getAllOperationStatuses();
  }

  @UseGuards(JwtAuthGuard)
  @Get('operation-statuses/:id')
  @ApiOperation({ summary: 'Get operation status by ID' })
  @ApiParam({ name: 'id', description: 'Operation Status ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Operation status retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Operation status not found.' })
  async getOperationStatusById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogsService.getOperationStatusById(id);
  }
}