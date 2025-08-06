// forexTradingApi/src/modules/operations/fx-operations.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { FxOperationSpot } from './entities/fx-operation-spot.entity';
import { CreateFxOperationSpotDto } from './dto/create-fx-operation-spot.dto';
import { UpdateFxOperationSpotDto } from './dto/update-fx-operation-spot.dto';
import { QueryFxOperationSpotDto } from './dto/query-fx-operation-spot.dto';

@Injectable()
export class FxOperationsService {
  constructor(
    @InjectRepository(FxOperationSpot)
    private operationRepository: Repository<FxOperationSpot>,
  ) {}

  async create(createOperationDto: CreateFxOperationSpotDto): Promise<FxOperationSpot> {
    // TODO: Validaciones de negocio
    // - Verificar que el cliente existe y está activo
    // - Verificar que las divisas existen y están activas
    // - Validar el par de divisas
    // - Validar fechas (value_date >= start_date)
    // - Validar que los folders existen (si se proporcionan)

    const operation = this.operationRepository.create({
      ...createOperationDto,
      registerDate: new Date(),
    });

    const savedOperation = await this.operationRepository.save(operation);
    
    // TODO: Crear evento de creación en fx_operation_spot_event
    
    return this.findOne(savedOperation.id);
  }

  async findAll(queryDto?: QueryFxOperationSpotDto): Promise<{
    data: FxOperationSpot[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = this.operationRepository.createQueryBuilder('operation')
      .leftJoinAndSelect('operation.client', 'client')
      .leftJoinAndSelect('operation.user', 'user')
      .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
      .leftJoinAndSelect('operation.quoteCurrency', 'quoteCurrency')
      .leftJoinAndSelect('operation.origin', 'origin')
      .leftJoinAndSelect('operation.segment', 'segment')
      .leftJoinAndSelect('operation.status', 'status')
      .leftJoinAndSelect('operation.tradingFolder', 'tradingFolder')
      .leftJoinAndSelect('operation.salesFolder', 'salesFolder');

    // Aplicar filtros
    if (queryDto?.clientId) {
      query.andWhere('operation.clientId = :clientId', { clientId: queryDto.clientId });
    }

    if (queryDto?.userId) {
      query.andWhere('operation.userId = :userId', { userId: queryDto.userId });
    }

    if (queryDto?.baseCurrencyId) {
      query.andWhere('operation.baseCurrencyId = :baseCurrencyId', { baseCurrencyId: queryDto.baseCurrencyId });
    }

    if (queryDto?.quoteCurrencyId) {
      query.andWhere('operation.quoteCurrencyId = :quoteCurrencyId', { quoteCurrencyId: queryDto.quoteCurrencyId });
    }

    if (queryDto?.operationSide) {
      query.andWhere('operation.operationSide = :operationSide', { operationSide: queryDto.operationSide });
    }

    if (queryDto?.statusId) {
      query.andWhere('operation.statusId = :statusId', { statusId: queryDto.statusId });
    }

    if (queryDto?.originId) {
      query.andWhere('operation.originId = :originId', { originId: queryDto.originId });
    }

    if (queryDto?.segmentId) {
      query.andWhere('operation.segmentId = :segmentId', { segmentId: queryDto.segmentId });
    }

    // Filtros de fecha
    if (queryDto?.startDateFrom && queryDto?.startDateTo) {
      query.andWhere('operation.startDate BETWEEN :startDateFrom AND :startDateTo', {
        startDateFrom: queryDto.startDateFrom,
        startDateTo: queryDto.startDateTo,
      });
    } else if (queryDto?.startDateFrom) {
      query.andWhere('operation.startDate >= :startDateFrom', { startDateFrom: queryDto.startDateFrom });
    } else if (queryDto?.startDateTo) {
      query.andWhere('operation.startDate <= :startDateTo', { startDateTo: queryDto.startDateTo });
    }

    // Contar total antes de aplicar paginación
    const total = await query.getCount();

    // Aplicar paginación
    const page = queryDto?.page || 1;
    const limit = queryDto?.limit || 20;
    const skip = (page - 1) * limit;

    const data = await query
      .orderBy('operation.registerDate', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      totalPages,
    };
  }

  async findPending(): Promise<FxOperationSpot[]> {
    return this.operationRepository.find({
      where: { statusId: 2 }, // Asumiendo que 2 es "pendiente"
      relations: [
        'client',
        'user',
        'baseCurrency',
        'quoteCurrency',
        'origin',
        'segment',
        'status',
        'tradingFolder',
        'salesFolder'
      ],
      order: { registerDate: 'DESC' },
    });
  }

  async findByCurrency(currencyId: number): Promise<FxOperationSpot[]> {
    return this.operationRepository.find({
      where: [
        { baseCurrencyId: currencyId },
        { quoteCurrencyId: currencyId }
      ],
      relations: [
        'client',
        'user',
        'baseCurrency',
        'quoteCurrency',
        'origin',
        'segment',
        'status'
      ],
      order: { registerDate: 'DESC' },
      take: 100, // Limitar resultados
    });
  }

  async findLatestByCurrency(currencyId: number, limit: number = 10): Promise<FxOperationSpot[]> {
    return this.operationRepository.find({
      where: [
        { baseCurrencyId: currencyId },
        { quoteCurrencyId: currencyId }
      ],
      relations: [
        'client',
        'user',
        'baseCurrency',
        'quoteCurrency',
        'origin',
        'segment',
        'status'
      ],
      order: { registerDate: 'DESC' },
      take: limit,
    });
  }

  async findOne(id: number): Promise<FxOperationSpot> {
    const operation = await this.operationRepository.findOne({
      where: { id },
      relations: [
        'client',
        'client.segment',
        'user',
        'baseCurrency',
        'quoteCurrency',
        'origin',
        'segment',
        'status',
        'tradingFolder',
        'salesFolder',
        'creator',
        'modifier'
      ],
    });

    if (!operation) {
      throw new NotFoundException(`FX Operation with ID ${id} not found`);
    }

    return operation;
  }

  async update(id: number, updateOperationDto: UpdateFxOperationSpotDto, modifiedBy: number): Promise<FxOperationSpot> {
    const operation = await this.findOne(id);

    // Validaciones de negocio para actualización
    if (operation.statusId === 1) { // Si está completada
      throw new BadRequestException('Cannot modify completed operation');
    }

    // TODO: Más validaciones según el estado y workflow

    await this.operationRepository.update(id, {
      ...updateOperationDto,
      modifiedBy,
      modifiedAt: new Date(),
    });

    // TODO: Crear evento de modificación en fx_operation_spot_event

    return this.findOne(id);
  }

  async confirm(id: number, modifiedBy: number): Promise<FxOperationSpot> {
    const operation = await this.findOne(id);

    if (operation.statusId === 1) {
      throw new BadRequestException('Operation is already confirmed');
    }

    await this.operationRepository.update(id, {
      statusId: 1, // Completada
      workflowStep: 'COMPLETED',
      modifiedBy,
      modifiedAt: new Date(),
    });

    // TODO: Crear evento de confirmación
    // TODO: Calcular PnL si es necesario
    // TODO: Notificar a sistemas externos

    return this.findOne(id);
  }

  async cancel(id: number, modifiedBy: number, reason?: string): Promise<FxOperationSpot> {
    const operation = await this.findOne(id);

    if (operation.statusId === 3) {
      throw new BadRequestException('Operation is already cancelled');
    }

    if (operation.statusId === 1) {
      throw new BadRequestException('Cannot cancel completed operation');
    }

    const updateData: any = {
      statusId: 3, // Anulada
      workflowStep: 'CANCELLED',
      modifiedBy,
      modifiedAt: new Date(),
    };

    if (reason) {
      updateData.comments = operation.comments 
        ? `${operation.comments}\n[CANCELLED]: ${reason}`
        : `[CANCELLED]: ${reason}`;
    }

    await this.operationRepository.update(id, updateData);

    // TODO: Crear evento de anulación
    // TODO: Notificar a sistemas externos

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const operation = await this.findOne(id);
    
    if (operation.statusId === 1) {
      throw new BadRequestException('Cannot delete completed operation');
    }
    
    await this.operationRepository.remove(operation);
  }

  // Métodos para el módulo de Trading - Posición MX
  async getPositionMXByCurrency(currency: string): Promise<{
    currency: string;
    channels: {
      channel: string;
      buyAmount: number;
      buyAvgPrice: number;
      sellAmount: number;
      sellAvgPrice: number;
      netPosition: number;
    }[];
  }> {
    // TODO: Esta consulta debería usar una vista o tabla específica de posiciones
    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
      .leftJoinAndSelect('operation.quoteCurrency', 'quoteCurrency')
      .leftJoinAndSelect('operation.origin', 'origin')
      .where('baseCurrency.code = :currency OR quoteCurrency.code = :currency', { currency })
      .andWhere('operation.statusId = :statusId', { statusId: 1 }) // Solo completadas
      .getMany();

    // Agrupar por canal (origin)
    const channelPositions = new Map();

    operations.forEach(op => {
      const channelName = op.origin?.code || 'UNKNOWN';
      
      if (!channelPositions.has(channelName)) {
        channelPositions.set(channelName, {
          channel: channelName,
          buyAmount: 0,
          buyTotal: 0,
          sellAmount: 0,
          sellTotal: 0,
          buyCount: 0,
          sellCount: 0,
        });
      }

      const position = channelPositions.get(channelName);
      
      // Determinar si es compra o venta de la divisa objetivo
      const isBuyingCurrency = (op.operationSide === 'buy' && op.baseCurrency.code === currency) ||
                              (op.operationSide === 'sell' && op.quoteCurrency.code === currency);

      if (isBuyingCurrency) {
        position.buyAmount += op.amountCurrency1;
        position.buyTotal += op.amountCurrency1 * op.clientPrice;
        position.buyCount += 1;
      } else {
        position.sellAmount += op.amountCurrency1;
        position.sellTotal += op.amountCurrency1 * op.clientPrice;
        position.sellCount += 1;
      }
    });

    // Calcular promedios y posición neta
    const channels = Array.from(channelPositions.values()).map(pos => ({
      channel: pos.channel,
      buyAmount: pos.buyAmount,
      buyAvgPrice: pos.buyCount > 0 ? pos.buyTotal / pos.buyAmount : 0,
      sellAmount: pos.sellAmount,
      sellAvgPrice: pos.sellCount > 0 ? pos.sellTotal / pos.sellAmount : 0,
      netPosition: pos.buyAmount - pos.sellAmount,
    }));

    return {
      currency,
      channels: channels.sort((a, b) => a.channel.localeCompare(b.channel)),
    };
  }

  // Métodos de estadísticas
  async getOperationStats(): Promise<{
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    byStatus: { statusId: number; count: number }[];
    byOperationSide: { side: string; count: number }[];
  }> {
    const [total, pending, completed, cancelled] = await Promise.all([
      this.operationRepository.count(),
      this.operationRepository.count({ where: { statusId: 2 } }),
      this.operationRepository.count({ where: { statusId: 1 } }),
      this.operationRepository.count({ where: { statusId: 3 } })
    ]);

    const [byStatus, byOperationSide] = await Promise.all([
      this.operationRepository
        .createQueryBuilder('operation')
        .select('operation.statusId', 'statusId')
        .addSelect('COUNT(*)', 'count')
        .groupBy('operation.statusId')
        .getRawMany(),
      this.operationRepository
        .createQueryBuilder('operation')
        .select('operation.operationSide', 'side')
        .addSelect('COUNT(*)', 'count')
        .groupBy('operation.operationSide')
        .getRawMany()
    ]);

    return {
      total,
      pending,
      completed,
      cancelled,
      byStatus: byStatus.map(item => ({
        statusId: parseInt(item.statusId),
        count: parseInt(item.count)
      })),
      byOperationSide: byOperationSide.map(item => ({
        side: item.side,
        count: parseInt(item.count)
      }))
    };
  }

  async getVolumeAnalysis(days: number = 30): Promise<{
    totalVolume: number;
    averageDailyVolume: number;
    byCurrency: { currency: string; volume: number }[];
    byChannel: { channel: string; volume: number }[];
  }> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const operations = await this.operationRepository
      .createQueryBuilder('operation')
      .leftJoinAndSelect('operation.baseCurrency', 'baseCurrency')
      .leftJoinAndSelect('operation.origin', 'origin')
      .where('operation.registerDate >= :fromDate', { fromDate })
      .andWhere('operation.statusId = :statusId', { statusId: 1 }) // Solo completadas
      .getMany();

    const totalVolume = operations.reduce((sum, op) => sum + op.amountCurrency2, 0);
    const averageDailyVolume = totalVolume / days;

    // Agrupar por divisa base
    const currencyVolumes = new Map();
    const channelVolumes = new Map();

    operations.forEach(op => {
      const currency = op.baseCurrency.code;
      const channel = op.origin?.code || 'UNKNOWN';

      currencyVolumes.set(currency, (currencyVolumes.get(currency) || 0) + op.amountCurrency2);
      channelVolumes.set(channel, (channelVolumes.get(channel) || 0) + op.amountCurrency2);
    });

    return {
      totalVolume,
      averageDailyVolume,
      byCurrency: Array.from(currencyVolumes.entries())
        .map(([currency, volume]) => ({ currency, volume }))
        .sort((a, b) => b.volume - a.volume),
      byChannel: Array.from(channelVolumes.entries())
        .map(([channel, volume]) => ({ channel, volume }))
        .sort((a, b) => b.volume - a.volume)
    };
  }

  // Método para calcular PnL de una operación
  async calculatePnL(operationId: number, marketPrice: number): Promise<number> {
    const operation = await this.findOne(operationId);
    
    // PnL = (Precio de Mercado - Precio de Costo) * Monto * Signo
    const sign = operation.operationSide === 'buy' ? 1 : -1;
    const priceDiff = marketPrice - operation.costPrice;
    const pnl = priceDiff * operation.amountCurrency1 * sign;

    // Actualizar el PnL calculado en la operación
    await this.operationRepository.update(operationId, {
      pnlCalculated: pnl,
      modifiedAt: new Date(),
    });

    return pnl;
  }
}