import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
export declare class CurrenciesController {
    private readonly currenciesService;
    constructor(currenciesService: CurrenciesService);
    create(createCurrencyDto: CreateCurrencyDto): Promise<import("./entities/currency.entity").Currency>;
    findAll(): Promise<import("./entities/currency.entity").Currency[]>;
    findOne(id: number): Promise<import("./entities/currency.entity").Currency>;
    update(id: number, updateCurrencyDto: UpdateCurrencyDto): Promise<import("./entities/currency.entity").Currency>;
    remove(id: number): Promise<void>;
}
