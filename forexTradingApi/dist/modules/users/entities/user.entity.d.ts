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
}
