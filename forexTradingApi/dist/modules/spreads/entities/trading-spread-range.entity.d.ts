import { Currency } from '../../currencies/entities/currency.entity';
import { MarketScenario } from '../../catalogs/entities/market-scenario.entity';
export declare class TradingSpreadRange {
    id: number;
    currencyId: number;
    scenarioId: number;
    amountMin: number;
    amountMax: number;
    spread: number;
    createdAt: Date;
    currency: Currency;
    scenario: MarketScenario;
}
