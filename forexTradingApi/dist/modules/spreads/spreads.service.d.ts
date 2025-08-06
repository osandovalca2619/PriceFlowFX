import { Repository } from 'typeorm';
import { TradingSpreadRange } from './entities/trading-spread-range.entity';
import { SalesSpread } from './entities/sales-spread.entity';
import { CreateTradingSpreadDto } from './dto/create-trading-spread.dto';
import { UpdateTradingSpreadDto } from './dto/update-trading-spread.dto';
import { CreateSalesSpreadDto } from './dto/create-sales-spread.dto';
import { UpdateSalesSpreadDto } from './dto/update-sales-spread.dto';
import { QueryTradingSpreadDto } from './dto/query-trading-spread.dto';
import { QuerySalesSpreadDto } from './dto/query-sales-spread.dto';
export declare class SpreadsService {
    private tradingSpreadRepository;
    private salesSpreadRepository;
    constructor(tradingSpreadRepository: Repository<TradingSpreadRange>, salesSpreadRepository: Repository<SalesSpread>);
    createTradingSpread(createSpreadDto: CreateTradingSpreadDto): Promise<TradingSpreadRange>;
    findAllTradingSpreads(queryDto?: QueryTradingSpreadDto): Promise<TradingSpreadRange[]>;
    findTradingSpreadById(id: number): Promise<TradingSpreadRange>;
    findTradingSpreadsByCurrency(currencyId: number): Promise<TradingSpreadRange[]>;
    updateTradingSpread(id: number, updateSpreadDto: UpdateTradingSpreadDto): Promise<TradingSpreadRange>;
    deleteTradingSpread(id: number): Promise<void>;
    createSalesSpread(createSpreadDto: CreateSalesSpreadDto): Promise<SalesSpread>;
    findAllSalesSpreads(queryDto?: QuerySalesSpreadDto): Promise<SalesSpread[]>;
    findSalesSpreadById(id: number): Promise<SalesSpread>;
    findSalesSpreadsByOrigin(originId: number): Promise<SalesSpread[]>;
    findSalesSpreadsBySegment(segmentId: number): Promise<SalesSpread[]>;
    updateSalesSpread(id: number, updateSpreadDto: UpdateSalesSpreadDto): Promise<SalesSpread>;
    deleteSalesSpread(id: number): Promise<void>;
    getApplicableSpread(params: {
        baseCurrencyId: number;
        quoteCurrencyId: number;
        originId: number;
        segmentId: number;
        fxProductId: number;
        marketHours: boolean;
        amount: number;
        scenarioId: number;
        clientId?: number;
    }): Promise<{
        tradingSpread?: number;
        salesSpread?: {
            buy: number;
            sell: number;
        };
    }>;
    getTradingSpreadMatrix(currencyId: number): Promise<{
        currency: string;
        scenarios: Array<{
            scenarioId: number;
            scenarioName: string;
            ranges: Array<{
                amountMin: number;
                amountMax: number;
                spread: number;
            }>;
        }>;
    }>;
    getSalesSpreadMatrix(filters?: {
        baseCurrencyId?: number;
        quoteCurrencyId?: number;
        originId?: number;
    }): Promise<Array<{
        pair: string;
        origin: string;
        segments: Array<{
            segmentName: string;
            marketHours: {
                buy: number;
                sell: number;
            };
            afterHours: {
                buy: number;
                sell: number;
            };
        }>;
    }>>;
    getSpreadStats(): Promise<{
        trading: {
            total: number;
            byCurrency: Array<{
                currency: string;
                count: number;
            }>;
            byScenario: Array<{
                scenario: string;
                count: number;
            }>;
        };
        sales: {
            total: number;
            byOrigin: Array<{
                origin: string;
                count: number;
            }>;
            bySegment: Array<{
                segment: string;
                count: number;
            }>;
        };
    }>;
}
