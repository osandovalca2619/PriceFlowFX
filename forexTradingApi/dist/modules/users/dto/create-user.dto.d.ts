export declare class CreateUserDto {
    username: string;
    fullName: string;
    profileId: number;
    salesGroupId?: number;
    status?: 'activo' | 'inactivo';
    createdBy: number;
    password?: string;
}
