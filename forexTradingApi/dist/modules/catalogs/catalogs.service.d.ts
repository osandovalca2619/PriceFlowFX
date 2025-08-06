import { Repository } from 'typeorm';
import { Segment } from './entities/segment.entity';
import { QuoteOrigin } from './entities/quote-origin.entity';
import { FxProduct } from './entities/fx-product.entity';
import { MarketScenario } from './entities/market-scenario.entity';
import { FxOperationStatus } from '../operations/entities/fx-operation-status.entity';
export declare class CatalogsService {
    private segmentRepository;
    private quoteOriginRepository;
    private fxProductRepository;
    private marketScenarioRepository;
    private operationStatusRepository;
    constructor(segmentRepository: Repository<Segment>, quoteOriginRepository: Repository<QuoteOrigin>, fxProductRepository: Repository<FxProduct>, marketScenarioRepository: Repository<MarketScenario>, operationStatusRepository: Repository<FxOperationStatus>);
    getAllSegments(): Promise<Segment[]>;
    getSegmentById(id: number): Promise<Segment>;
    getAllQuoteOrigins(): Promise<QuoteOrigin[]>;
    getActiveQuoteOrigins(): Promise<QuoteOrigin[]>;
    getQuoteOriginById(id: number): Promise<QuoteOrigin>;
    getQuoteOriginByCode(code: string): Promise<QuoteOrigin | null>;
    getAllFxProducts(): Promise<FxProduct[]>;
    getActiveFxProducts(): Promise<FxProduct[]>;
    getFxProductById(id: number): Promise<FxProduct>;
    getFxProductByCode(code: string): Promise<FxProduct | null>;
    getAllMarketScenarios(): Promise<MarketScenario[]>;
    getActiveMarketScenarios(): Promise<MarketScenario[]>;
    getMarketScenarioById(id: number): Promise<MarketScenario>;
    getMarketScenarioByCode(code: string): Promise<MarketScenario | null>;
    getAllOperationStatuses(): Promise<FxOperationStatus[]>;
    getOperationStatusById(id: number): Promise<FxOperationStatus>;
    getOperationStatusByCode(code: string): Promise<FxOperationStatus | null>;
    getAllCatalogs(): Promise<{
        segments: Segment[];
        quoteOrigins: QuoteOrigin[];
        fxProducts: FxProduct[];
        marketScenarios: MarketScenario[];
        operationStatuses: FxOperationStatus[];
    }>;
    getActiveCatalogs(): Promise<{
        segments: Segment[];
        quoteOrigins: QuoteOrigin[];
        fxProducts: FxProduct[];
        marketScenarios: MarketScenario[];
    }>;
    validateCatalogReferences(references: {
        segmentId?: number;
        originId?: number;
        fxProductId?: number;
        scenarioId?: number;
        statusId?: number;
    }): Promise<boolean>;
}
