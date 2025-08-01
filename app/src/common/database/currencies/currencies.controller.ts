import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Currency } from '../entities/Currency';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  create(@Body() createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.currenciesService.remove(id);
  }
}
