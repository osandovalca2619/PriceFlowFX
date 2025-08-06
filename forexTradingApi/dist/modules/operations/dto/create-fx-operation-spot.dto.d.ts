import { OperationSide } from '../entities/fx-operation-spot.entity';
export declare class CreateFxOperationSpotDto {
    clientId: number;
    userId: number;
    amountCurrency1: number;
    amountCurrency2: number;
    costPrice: number;
    margin: number;
    clientPrice: number;
    startDate: string;
    valueDate: string;
    paymentMethodCurrency1?: string;
    paymentMethodCurrency2?: string;
    operationSide: OperationSide;
    baseCurrencyId: number;
    quoteCurrencyId: number;
    originId: number;
    segmentId: number;
    destinationSystemId?: number;
    sourceSystemId?: number;
    comments?: string;
    tradingFolderId?: number;
    salesFolderId?: number;
    workflowStep?: string;
    statusId?: number;
    createdBy: number;
}
