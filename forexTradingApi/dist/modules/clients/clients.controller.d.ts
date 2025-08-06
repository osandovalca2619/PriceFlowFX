import type { Request as ExpressRequest } from 'express';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
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
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: CreateClientDto, req: AuthenticatedRequest): Promise<import("./entities/client.entity").Client>;
    findAll(queryDto: QueryClientDto): Promise<{
        data: import("./entities/client.entity").Client[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findActive(): Promise<import("./entities/client.entity").Client[]>;
    searchClients(query: string, limit?: number): Promise<import("./entities/client.entity").Client[]>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        bySegment: {
            segmentId: number;
            count: number;
        }[];
    }>;
    findBySegment(segmentId: number): Promise<import("./entities/client.entity").Client[]>;
    findByIdentifier(identifier: string): Promise<import("./entities/client.entity").Client>;
    findOne(id: number): Promise<import("./entities/client.entity").Client>;
    update(id: number, updateClientDto: UpdateClientDto, req: AuthenticatedRequest): Promise<import("./entities/client.entity").Client>;
    deactivate(id: number, req: AuthenticatedRequest): Promise<import("./entities/client.entity").Client>;
    activate(id: number, req: AuthenticatedRequest): Promise<import("./entities/client.entity").Client>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
export {};
