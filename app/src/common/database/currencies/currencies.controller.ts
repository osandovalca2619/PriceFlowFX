import { Controller, Get } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { Currency } from '../entities/Currency';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }
}
