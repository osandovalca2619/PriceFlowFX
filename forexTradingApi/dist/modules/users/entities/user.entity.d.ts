import { UserProfile } from './user-profile.entity';
export declare class User {
    id: number;
    username: string;
    fullName: string;
    profileId: number;
    salesGroupId: number | null;
    status: 'activo' | 'inactivo';
    createdBy: number;
    createdAt: Date;
    modifiedBy: number | null;
    modifiedAt: Date | null;
    password?: string;
    profile: UserProfile;
    creator?: User;
    modifier?: User;
    transactions: Transaction[];
}
import { Transaction } from '../../transactions/entities/transaction.entity';
