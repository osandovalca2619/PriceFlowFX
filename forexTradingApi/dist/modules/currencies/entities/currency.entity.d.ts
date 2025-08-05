import { User } from '../../users/entities/user.entity';
export declare class Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    country: string;
    decimals: number;
    isStrongCurrency: boolean;
    createdBy: number;
    createdAt: Date;
    modifiedBy: number;
    modifiedAt: Date;
    status: string;
    creator: User;
    modifier: User;
}
