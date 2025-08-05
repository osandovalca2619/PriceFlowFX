// forexTradingApi/src/modules/currencies/currencies.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('currencies')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new currency',
    description: 'Creates a new currency in the system'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Currency created successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Currency with this code already exists' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized' 
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all currencies',
    description: 'Retrieves a list of all currencies in the system'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of currencies retrieved successfully' 
  })
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get('active')
  @ApiOperation({ 
    summary: 'Get active currencies',
    description: 'Retrieves a list of all active currencies'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of active currencies retrieved successfully' 
  })
  findActive() {
    return this.currenciesService.findActive();
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get currency statistics',
    description: 'Retrieves statistics about currencies in the system'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency statistics retrieved successfully' 
  })
  getStats() {
    return this.currenciesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get currency by ID',
    description: 'Retrieves a specific currency by its ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Currency ID',
    type: 'integer'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency found successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.currenciesService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ 
    summary: 'Get currency by code',
    description: 'Retrieves a specific currency by its code (e.g., USD, EUR)'
  })
  @ApiParam({ 
    name: 'code', 
    description: 'Currency code (3 characters)',
    example: 'USD'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency found successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  findByCode(@Param('code') code: string) {
    return this.currenciesService.findByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update currency',
    description: 'Updates an existing currency'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Currency ID',
    type: 'integer'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency updated successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Currency code already exists' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ 
    summary: 'Deactivate currency',
    description: 'Deactivates a currency (sets status to inactive)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Currency ID',
    type: 'integer'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency deactivated successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { modifiedBy: number }
  ) {
    return this.currenciesService.deactivate(id, body.modifiedBy);
  }

  @Patch(':id/activate')
  @ApiOperation({ 
    summary: 'Activate currency',
    description: 'Activates a currency (sets status to active)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Currency ID',
    type: 'integer'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency activated successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  activate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { modifiedBy: number }
  ) {
    return this.currenciesService.activate(id, body.modifiedBy);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete currency',
    description: 'Permanently deletes a currency from the system'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Currency ID',
    type: 'integer'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Currency deleted successfully' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Currency not found' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.currenciesService.remove(id);
  }
}