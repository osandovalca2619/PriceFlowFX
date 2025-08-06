import type { Request as ExpressRequest } from 'express';
import { OperationFoldersService } from './operation-folders.service';
import { CreateOperationFolderDto } from './dto/create-operation-folder.dto';
import { UpdateOperationFolderDto } from './dto/update-operation-folder.dto';
import { QueryOperationFolderDto } from './dto/query-operation-folder.dto';
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
export declare class OperationFoldersController {
    private readonly foldersService;
    constructor(foldersService: OperationFoldersService);
    create(createFolderDto: CreateOperationFolderDto, req: AuthenticatedRequest): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    findAll(queryDto: QueryOperationFolderDto): Promise<import("./entities/operation-folder.entity").OperationFolder[]>;
    findActive(): Promise<import("./entities/operation-folder.entity").OperationFolder[]>;
    findTradingFolders(): Promise<import("./entities/operation-folder.entity").OperationFolder[]>;
    findSalesFolders(): Promise<import("./entities/operation-folder.entity").OperationFolder[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byType: {
            type: string;
            count: number;
        }[];
    }>;
    findByCode(code: string): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    findOne(id: number): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    update(id: number, updateFolderDto: UpdateOperationFolderDto, req: AuthenticatedRequest): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    deactivate(id: number, req: AuthenticatedRequest): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    activate(id: number, req: AuthenticatedRequest): Promise<import("./entities/operation-folder.entity").OperationFolder>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
