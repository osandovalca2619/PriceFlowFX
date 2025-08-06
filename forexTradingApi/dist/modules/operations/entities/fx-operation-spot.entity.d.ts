import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Currency } from '../../currencies/entities/currency.entity';
import { OperationFolder } from '../../books/entities/operation-folder.entity';
import { FxOperationStatus } from './fx-operation-status.entity';
import { QuoteOrigin } from '../../catalogs/entities/quote-origin.entity';
import { Segment } from '../../catalogs/entities/segment.entity';
export declare enum OperationSide {
    BUY = "buy",
    SELL = "sell"
}
export declare class FxOperationSpot {
    id: number;
    clientId: number;
    userId: number;
    amountCurrency1: number;
    amountCurrency2: number;
    costPrice: number;
    margin: number;
    clientPrice: number;
    startDate: Date;
    registerDate: Date;
    valueDate: Date;
    paymentMethodCurrency1: string;
    paymentMethodCurrency2: string;
    operationSide: OperationSide;
    baseCurrencyId: number;
    quoteCurrencyId: number;
    originId: number;
    segmentId: number;
    destinationSystemId: number;
    sourceSystemId: number;
    comments: string;
    tradingFolderId: number;
    salesFolderId: number;
    pnlCalculated: number;
    workflowStep: string;
    statusId: number;
    createdBy: number;
    createdAt: Date;
    modifiedBy: number | null;
    modifiedAt: Date | null;
    client: Client;
    user: User;
    baseCurrency: Currency;
    quoteCurrency: Currency;
    origin: QuoteOrigin;
    segment: Segment;
    tradingFolder: OperationFolder;
    salesFolder: OperationFolder;
    status: FxOperationStatus;
    creator: User;
    modifier: User;
}
