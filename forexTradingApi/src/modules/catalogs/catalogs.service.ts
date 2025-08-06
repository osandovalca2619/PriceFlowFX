// forexTradingApi/src/modules/catalogs/catalogs.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Segment } from './entities/segment.entity';
import { QuoteOrigin } from './entities/quote-origin.entity';
import { FxProduct } from './entities/fx-product.entity';
import { MarketScenario } from './entities/market-scenario.entity';
import { FxOperationStatus } from '../operations/entities/fx-operation-status.entity';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(Segment)
    private segmentRepository: Repository<Segment>,
    @InjectRepository(QuoteOrigin)
    private quoteOriginRepository: Repository<QuoteOrigin>,
    @InjectRepository(FxProduct)
    private fxProductRepository: Repository<FxProduct>,
    @InjectRepository(MarketScenario)
    private marketScenarioRepository: Repository<MarketScenario>,
    @InjectRepository(FxOperationStatus)
    private operationStatusRepository: Repository<FxOperationStatus>,
  ) {}

  // =============================================
  // SEGMENTS
  // =============================================
  async getAllSegments(): Promise<Segment[]> {
    return this.segmentRepository.find({
      order: { name: 'ASC' }
    });
  }

  async getSegmentById(id: number): Promise<Segment> {
    const segment = await this.segmentRepository.findOne({ where: { id } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID ${id} not found`);
    }
    return segment;
  }

  // =============================================
  // QUOTE ORIGINS (Channels)
  // =============================================
  async getAllQuoteOrigins(): Promise<QuoteOrigin[]> {
    return this.quoteOriginRepository.find({
      order: { code: 'ASC' }
    });
  }

  async getActiveQuoteOrigins(): Promise<QuoteOrigin[]> {
    return this.quoteOriginRepository.find({
      where: { active: true },
      order: { code: 'ASC' }
    });
  }

  async getQuoteOriginById(id: number): Promise<QuoteOrigin> {
    const origin = await this.quoteOriginRepository.findOne({ where: { id } });
    if (!origin) {
      throw new NotFoundException(`Quote origin with ID ${id} not found`);
    }
    return origin;
  }

  async getQuoteOriginByCode(code: string): Promise<QuoteOrigin | null> {
    return this.quoteOriginRepository.findOne({
      where: { code: code.toUpperCase() }
    });
  }

  // =============================================
  // FX PRODUCTS
  // =============================================
  async getAllFxProducts(): Promise<FxProduct[]> {
    return this.fxProductRepository.find({
      order: { code: 'ASC' }
    });
  }

  async getActiveFxProducts(): Promise<FxProduct[]> {
    return this.fxProductRepository.find({
      where: { active: true },
      order: { code: 'ASC' }
    });
  }

  async getFxProductById(id: number): Promise<FxProduct> {
    const product = await this.fxProductRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`FX Product with ID ${id} not found`);
    }
    return product;
  }

  async getFxProductByCode(code: string): Promise<FxProduct | null> {
    return this.fxProductRepository.findOne({
      where: { code: code.toUpperCase() }
    });
  }

  // =============================================
  // MARKET SCENARIOS
  // =============================================
  async getAllMarketScenarios(): Promise<MarketScenario[]> {
    return this.marketScenarioRepository.find({
      order: { volatilityMultiplier: 'ASC' }
    });
  }

  async getActiveMarketScenarios(): Promise<MarketScenario[]> {
    return this.marketScenarioRepository.find({
      where: { active: true },
      order: { volatilityMultiplier: 'ASC' }
    });
  }

  async getMarketScenarioById(id: number): Promise<MarketScenario> {
    const scenario = await this.marketScenarioRepository.findOne({ where: { id } });
    if (!scenario) {
      throw new NotFoundException(`Market scenario with ID ${id} not found`);
    }
    return scenario;
  }

  async getMarketScenarioByCode(code: string): Promise<MarketScenario | null> {
    return this.marketScenarioRepository.findOne({
      where: { code: code.toUpperCase() }
    });
  }

  // =============================================
  // OPERATION STATUS
  // =============================================
  async getAllOperationStatuses(): Promise<FxOperationStatus[]> {
    return this.operationStatusRepository.find({
      order: { displayOrder: 'ASC' }
    });
  }

  async getOperationStatusById(id: number): Promise<FxOperationStatus> {
    const status = await this.operationStatusRepository.findOne({ where: { id } });
    if (!status) {
      throw new NotFoundException(`Operation status with ID ${id} not found`);
    }
    return status;
  }

  async getOperationStatusByCode(code: string): Promise<FxOperationStatus | null> {
    return this.operationStatusRepository.findOne({
      where: { code: code.toLowerCase() }
    });
  }

  // =============================================
  // UTILITY METHODS
  // =============================================
  async getAllCatalogs(): Promise<{
    segments: Segment[];
    quoteOrigins: QuoteOrigin[];
    fxProducts: FxProduct[];
    marketScenarios: MarketScenario[];
    operationStatuses: FxOperationStatus[];
  }> {
    const [segments, quoteOrigins, fxProducts, marketScenarios, operationStatuses] = await Promise.all([
      this.getAllSegments(),
      this.getActiveQuoteOrigins(),
      this.getActiveFxProducts(),
      this.getActiveMarketScenarios(),
      this.getAllOperationStatuses(),
    ]);

    return {
      segments,
      quoteOrigins,
      fxProducts,
      marketScenarios,
      operationStatuses,
    };
  }

  async getActiveCatalogs(): Promise<{
    segments: Segment[];
    quoteOrigins: QuoteOrigin[];
    fxProducts: FxProduct[];
    marketScenarios: MarketScenario[];
  }> {
    const [segments, quoteOrigins, fxProducts, marketScenarios] = await Promise.all([
      this.getAllSegments(),
      this.getActiveQuoteOrigins(),
      this.getActiveFxProducts(),
      this.getActiveMarketScenarios(),
    ]);

    return {
      segments,
      quoteOrigins,
      fxProducts,
      marketScenarios,
    };
  }

  // Helper method para validar que todos los IDs de catálogo existan
  async validateCatalogReferences(references: {
    segmentId?: number;
    originId?: number;
    fxProductId?: number;
    scenarioId?: number;
    statusId?: number;
  }): Promise<boolean> {
    const validations: Promise<any>[] = [];

    if (references.segmentId) {
      validations.push(this.getSegmentById(references.segmentId));
    }
    if (references.originId) {
      validations.push(this.getQuoteOriginById(references.originId));
    }
    if (references.fxProductId) {
      validations.push(this.getFxProductById(references.fxProductId));
    }
    if (references.scenarioId) {
      validations.push(this.getMarketScenarioById(references.scenarioId));
    }
    if (references.statusId) {
      validations.push(this.getOperationStatusById(references.statusId));
    }

    try {
      await Promise.all(validations);
      return true;
    } catch (error) {
      return false;
    }
  }
}