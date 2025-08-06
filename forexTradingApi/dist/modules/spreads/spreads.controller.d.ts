import { SpreadsService } from './spreads.service';
import { CreateTradingSpreadDto } from './dto/create-trading-spread.dto';
import { UpdateTradingSpreadDto } from './dto/update-trading-spread.dto';
import { CreateSalesSpreadDto } from './dto/create-sales-spread.dto';
import { UpdateSalesSpreadDto } from './dto/update-sales-spread.dto';
import { QueryTradingSpreadDto } from './dto/query-trading-spread.dto';
import { QuerySalesSpreadDto } from './dto/query-sales-spread.dto';
export declare class SpreadsController {
    private readonly spreadsService;
    constructor(spreadsService: SpreadsService);
    createTradingSpread(createSpreadDto: CreateTradingSpreadDto): Promise<import("./entities/trading-spread-range.entity").TradingSpreadRange>;
    findAllTradingSpreads(queryDto: QueryTradingSpreadDto): Promise<import("./entities/trading-spread-range.entity").TradingSpreadRange[]>;
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
    findTradingSpreadsByCurrency(currencyId: number): Promise<import("./entities/trading-spread-range.entity").TradingSpreadRange[]>;
    findTradingSpreadById(id: number): Promise<import("./entities/trading-spread-range.entity").TradingSpreadRange>;
    updateTradingSpread(id: number, updateSpreadDto: UpdateTradingSpreadDto): Promise<import("./entities/trading-spread-range.entity").TradingSpreadRange>;
    deleteTradingSpread(id: number): Promise<{
        message: string;
    }>;
    createSalesSpread(createSpreadDto: CreateSalesSpreadDto): Promise<import("./entities/sales-spread.entity").SalesSpread>;
    findAllSalesSpreads(queryDto: QuerySalesSpreadDto): Promise<import("./entities/sales-spread.entity").SalesSpread[]>;
    getSalesSpreadMatrix(query: {
        baseCurrencyId?: number;
        quoteCurrencyId?: number;
        originId?: number;
    }): Promise<{
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
    }[]>;
    findSalesSpreadsByOrigin(originId: number): Promise<import("./entities/sales-spread.entity").SalesSpread[]>;
    findSalesSpreadsBySegment(segmentId: number): Promise<import("./entities/sales-spread.entity").SalesSpread[]>;
    findSalesSpreadById(id: number): Promise<import("./entities/sales-spread.entity").SalesSpread>;
    updateSalesSpread(id: number, updateSpreadDto: UpdateSalesSpreadDto): Promise<import("./entities/sales-spread.entity").SalesSpread>;
    deleteSalesSpread(id: number): Promise<{
        message: string;
    }>;
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
    findExceptionSpreads(): Promise<{
        message: string;
        data: never[];
        total: number;
    }>;
    createExceptionSpread(body: any): Promise<{
        message: string;
        data: any;
    }>;
    updateExceptionSpread(id: number, body: any): Promise<{
        message: string;
        id: number;
        data: any;
    }>;
    deleteExceptionSpread(id: number): Promise<{
        message: string;
        id: number;
    }>;
}
