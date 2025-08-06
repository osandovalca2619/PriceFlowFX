import { Repository } from 'typeorm';
import { FxOperationSpot } from './entities/fx-operation-spot.entity';
import { CreateFxOperationSpotDto } from './dto/create-fx-operation-spot.dto';
import { UpdateFxOperationSpotDto } from './dto/update-fx-operation-spot.dto';
import { QueryFxOperationSpotDto } from './dto/query-fx-operation-spot.dto';
export declare class FxOperationsService {
    private operationRepository;
    constructor(operationRepository: Repository<FxOperationSpot>);
    create(createOperationDto: CreateFxOperationSpotDto): Promise<FxOperationSpot>;
    findAll(queryDto?: QueryFxOperationSpotDto): Promise<{
        data: FxOperationSpot[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findPending(): Promise<FxOperationSpot[]>;
    findByCurrency(currencyId: number): Promise<FxOperationSpot[]>;
    findLatestByCurrency(currencyId: number, limit?: number): Promise<FxOperationSpot[]>;
    findOne(id: number): Promise<FxOperationSpot>;
    update(id: number, updateOperationDto: UpdateFxOperationSpotDto, modifiedBy: number): Promise<FxOperationSpot>;
    confirm(id: number, modifiedBy: number): Promise<FxOperationSpot>;
    cancel(id: number, modifiedBy: number, reason?: string): Promise<FxOperationSpot>;
    remove(id: number): Promise<void>;
    getPositionMXByCurrency(currency: string): Promise<{
        currency: string;
        channels: {
            channel: string;
            buyAmount: number;
            buyAvgPrice: number;
            sellAmount: number;
            sellAvgPrice: number;
            netPosition: number;
        }[];
    }>;
    getOperationStats(): Promise<{
        total: number;
        pending: number;
        completed: number;
        cancelled: number;
        byStatus: {
            statusId: number;
            count: number;
        }[];
        byOperationSide: {
            side: string;
            count: number;
        }[];
    }>;
    getVolumeAnalysis(days?: number): Promise<{
        totalVolume: number;
        averageDailyVolume: number;
        byCurrency: {
            currency: string;
            volume: number;
        }[];
        byChannel: {
            channel: string;
            volume: number;
        }[];
    }>;
    calculatePnL(operationId: number, marketPrice: number): Promise<number>;
}
