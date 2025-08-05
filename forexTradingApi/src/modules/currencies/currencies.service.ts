// forexTradingApi/src/modules/currencies/currencies.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    try {
      // Verificar si ya existe una divisa con el mismo código
      const existingCurrency = await this.currenciesRepository.findOne({
        where: { code: createCurrencyDto.code }
      });

      if (existingCurrency) {
        throw new ConflictException(`Currency with code ${createCurrencyDto.code} already exists`);
      }

      const currency = this.currenciesRepository.create({
        ...createCurrencyDto,
        createdAt: new Date(),
      });
      
      return await this.currenciesRepository.save(currency);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create currency: ${error.message}`);
    }
  }

  async findAll(): Promise<Currency[]> {
    return await this.currenciesRepository.find({
      order: { code: 'ASC' }
    });
  }

  async findActive(): Promise<Currency[]> {
    return await this.currenciesRepository.find({
      where: { status: 'activo' },
      order: { code: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Currency> {
    const currency = await this.currenciesRepository.findOne({ 
      where: { id } 
    });
    
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    
    return currency;
  }

  async findByCode(code: string): Promise<Currency> {
    const currency = await this.currenciesRepository.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }

    return currency;
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency> {
    const currency = await this.findOne(id);

    // Si se está actualizando el código, verificar que no exista otro con el mismo código
    if (updateCurrencyDto.code && updateCurrencyDto.code !== currency.code) {
      const existingCurrency = await this.currenciesRepository.findOne({
        where: { code: updateCurrencyDto.code }
      });

      if (existingCurrency) {
        throw new ConflictException(`Currency with code ${updateCurrencyDto.code} already exists`);
      }
    }

    // Actualizar campos
    Object.assign(currency, updateCurrencyDto);
    currency.modifiedAt = new Date();

    try {
      return await this.currenciesRepository.save(currency);
    } catch (error) {
      throw new Error(`Failed to update currency: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    const currency = await this.findOne(id);
    
    try {
      await this.currenciesRepository.remove(currency);
    } catch (error) {
      throw new Error(`Failed to delete currency: ${error.message}`);
    }
  }

  async deactivate(id: number, modifiedBy: number): Promise<Currency> {
    return await this.update(id, { 
      status: 'inactivo', 
      modifiedBy 
    });
  }

  async activate(id: number, modifiedBy: number): Promise<Currency> {
    return await this.update(id, { 
      status: 'activo', 
      modifiedBy 
    });
  }

  /**
   * Método para obtener estadísticas de divisas
   */
  async getStats() {
    const [
      total,
      active,
      inactive,
      strongCurrencies
    ] = await Promise.all([
      this.currenciesRepository.count(),
      this.currenciesRepository.count({ where: { status: 'activo' } }),
      this.currenciesRepository.count({ where: { status: 'inactivo' } }),
      this.currenciesRepository.count({ where: { isStrongCurrency: true } })
    ]);

    return {
      total,
      active,
      inactive,
      strongCurrencies,
      lastUpdated: new Date()
    };
  }
}