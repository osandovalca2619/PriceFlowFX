import { OperationSide } from '../entities/fx-operation-spot.entity';
export declare class QueryFxOperationSpotDto {
    clientId?: number;
    userId?: number;
    baseCurrencyId?: number;
    quoteCurrencyId?: number;
    operationSide?: OperationSide;
    statusId?: number;
    startDateFrom?: string;
    startDateTo?: string;
    originId?: number;
    segmentId?: number;
    page?: number;
    limit?: number;
}
