import { Repository } from 'typeorm';
import { OperationFolder, FolderType } from './entities/operation-folder.entity';
import { CreateOperationFolderDto } from './dto/create-operation-folder.dto';
import { UpdateOperationFolderDto } from './dto/update-operation-folder.dto';
import { QueryOperationFolderDto } from './dto/query-operation-folder.dto';
export declare class OperationFoldersService {
    private folderRepository;
    constructor(folderRepository: Repository<OperationFolder>);
    create(createFolderDto: CreateOperationFolderDto): Promise<OperationFolder>;
    findAll(queryDto?: QueryOperationFolderDto): Promise<OperationFolder[]>;
    findActive(): Promise<OperationFolder[]>;
    findByType(folderType: FolderType): Promise<OperationFolder[]>;
    findTradingFolders(): Promise<OperationFolder[]>;
    findSalesFolders(): Promise<OperationFolder[]>;
    findOne(id: number): Promise<OperationFolder>;
    findByCode(code: string): Promise<OperationFolder | null>;
    update(id: number, updateFolderDto: UpdateOperationFolderDto, modifiedBy: number): Promise<OperationFolder>;
    deactivate(id: number, modifiedBy: number): Promise<OperationFolder>;
    activate(id: number, modifiedBy: number): Promise<OperationFolder>;
    remove(id: number): Promise<void>;
    getFolderStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byType: {
            type: string;
            count: number;
        }[];
    }>;
}
