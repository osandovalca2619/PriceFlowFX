import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class CurrenciesService {
    private currenciesRepository;
    constructor(currenciesRepository: Repository<Currency>);
    create(createCurrencyDto: CreateCurrencyDto): Promise<Currency>;
    findAll(): Promise<Currency[]>;
    findActive(): Promise<Currency[]>;
    findOne(id: number): Promise<Currency>;
    findByCode(code: string): Promise<Currency>;
    update(id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<Currency>;
    remove(id: number): Promise<void>;
    deactivate(id: number, modifiedBy: number): Promise<Currency>;
    activate(id: number, modifiedBy: number): Promise<Currency>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        strongCurrencies: number;
        lastUpdated: Date;
    }>;
}
