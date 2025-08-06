import type { Request as ExpressRequest } from 'express';
import { FxOperationsService } from './fx-operations.service';
import { CreateFxOperationSpotDto } from './dto/create-fx-operation-spot.dto';
import { UpdateFxOperationSpotDto } from './dto/update-fx-operation-spot.dto';
import { QueryFxOperationSpotDto } from './dto/query-fx-operation-spot.dto';
interface AuthenticatedRequest extends ExpressRequest {
    user: {
        id: number;
        username: string;
        fullName: string;
        profileId: number;
        salesGroupId: number | null;
        status: string;
    };
}
export declare class FxOperationsController {
    private readonly operationsService;
    constructor(operationsService: FxOperationsService);
    create(createOperationDto: CreateFxOperationSpotDto, req: AuthenticatedRequest): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot>;
    findAll(queryDto: QueryFxOperationSpotDto): Promise<{
        data: import("./entities/fx-operation-spot.entity").FxOperationSpot[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findPending(): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot[]>;
    getStats(): Promise<{
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
    getPositionMX(currency: string): Promise<{
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
    findByCurrency(currencyId: number): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot[]>;
    findLatestByCurrency(currencyId: number, limit?: number): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot[]>;
    findOne(id: number): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot>;
    update(id: number, updateOperationDto: UpdateFxOperationSpotDto, req: AuthenticatedRequest): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot>;
    confirm(id: number, req: AuthenticatedRequest): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot>;
    cancel(id: number, req: AuthenticatedRequest, body?: {
        reason?: string;
    }): Promise<import("./entities/fx-operation-spot.entity").FxOperationSpot>;
    calculatePnL(id: number, body: {
        marketPrice: number;
    }): Promise<{
        pnl: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
