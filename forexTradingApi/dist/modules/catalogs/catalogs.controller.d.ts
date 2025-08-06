import { CatalogsService } from './catalogs.service';
export declare class CatalogsController {
    private readonly catalogsService;
    constructor(catalogsService: CatalogsService);
    getAllCatalogs(): Promise<{
        segments: import("./entities/segment.entity").Segment[];
        quoteOrigins: import("./entities/quote-origin.entity").QuoteOrigin[];
        fxProducts: import("./entities/fx-product.entity").FxProduct[];
        marketScenarios: import("./entities/market-scenario.entity").MarketScenario[];
        operationStatuses: import("../operations/entities/fx-operation-status.entity").FxOperationStatus[];
    }>;
    getActiveCatalogs(): Promise<{
        segments: import("./entities/segment.entity").Segment[];
        quoteOrigins: import("./entities/quote-origin.entity").QuoteOrigin[];
        fxProducts: import("./entities/fx-product.entity").FxProduct[];
        marketScenarios: import("./entities/market-scenario.entity").MarketScenario[];
    }>;
    getAllSegments(): Promise<import("./entities/segment.entity").Segment[]>;
    getSegmentById(id: number): Promise<import("./entities/segment.entity").Segment>;
    getAllQuoteOrigins(): Promise<import("./entities/quote-origin.entity").QuoteOrigin[]>;
    getActiveQuoteOrigins(): Promise<import("./entities/quote-origin.entity").QuoteOrigin[]>;
    getQuoteOriginById(id: number): Promise<import("./entities/quote-origin.entity").QuoteOrigin>;
    getQuoteOriginByCode(code: string): Promise<import("./entities/quote-origin.entity").QuoteOrigin>;
    getAllFxProducts(): Promise<import("./entities/fx-product.entity").FxProduct[]>;
    getActiveFxProducts(): Promise<import("./entities/fx-product.entity").FxProduct[]>;
    getFxProductById(id: number): Promise<import("./entities/fx-product.entity").FxProduct>;
    getAllMarketScenarios(): Promise<import("./entities/market-scenario.entity").MarketScenario[]>;
    getActiveMarketScenarios(): Promise<import("./entities/market-scenario.entity").MarketScenario[]>;
    getMarketScenarioById(id: number): Promise<import("./entities/market-scenario.entity").MarketScenario>;
    getAllOperationStatuses(): Promise<import("../operations/entities/fx-operation-status.entity").FxOperationStatus[]>;
    getOperationStatusById(id: number): Promise<import("../operations/entities/fx-operation-status.entity").FxOperationStatus>;
}
