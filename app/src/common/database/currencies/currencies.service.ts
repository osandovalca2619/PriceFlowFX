import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from '../entities/Currency';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  findAll(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  async findOne(id: number): Promise<Currency> {
    const currency = await this.currencyRepository.findOne({ where: { id } });
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return currency;
  }

  create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const currency = this.currencyRepository.create(createCurrencyDto);
    return this.currencyRepository.save(currency);
  }

  async update(
    id: number,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const currency = await this.currencyRepository.preload({
      id,
      ...updateCurrencyDto,
    });
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return this.currencyRepository.save(currency);
  }

  async remove(id: number): Promise<void> {
    const result = await this.currencyRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
  }
}
