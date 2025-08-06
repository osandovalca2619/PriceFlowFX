import { CreateFxOperationSpotDto } from './create-fx-operation-spot.dto';
declare const UpdateFxOperationSpotDto_base: import("@nestjs/common").Type<Partial<CreateFxOperationSpotDto>>;
export declare class UpdateFxOperationSpotDto extends UpdateFxOperationSpotDto_base {
    pnlCalculated?: number;
    modifiedBy?: number;
}
export {};
