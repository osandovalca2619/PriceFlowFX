import { User } from '../../users/entities/user.entity';
export declare enum FolderType {
    TRADING = "trading",
    SALES = "sales"
}
export declare class OperationFolder {
    id: number;
    code: string;
    name: string;
    folderType: FolderType;
    status: string;
    createdBy: number;
    createdAt: Date;
    modifiedBy: number | null;
    modifiedAt: Date | null;
    creator: User;
    modifier: User;
}
