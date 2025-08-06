import { FolderType } from '../entities/operation-folder.entity';
export declare class CreateOperationFolderDto {
    code: string;
    name: string;
    folderType: FolderType;
    status?: string;
    createdBy: number;
}
