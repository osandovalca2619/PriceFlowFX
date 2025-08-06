import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
export declare class ClientsService {
    private clientRepository;
    constructor(clientRepository: Repository<Client>);
    create(createClientDto: CreateClientDto): Promise<Client>;
    findAll(queryDto?: QueryClientDto): Promise<{
        data: Client[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findActive(): Promise<Client[]>;
    findOne(id: number): Promise<Client>;
    findByIdentifier(clientIdentifier: string): Promise<Client | null>;
    searchClients(query: string, limit?: number): Promise<Client[]>;
    findBySegment(segmentId: number): Promise<Client[]>;
    update(id: number, updateClientDto: UpdateClientDto, modifiedBy: number): Promise<Client>;
    deactivate(id: number, modifiedBy: number): Promise<Client>;
    activate(id: number, modifiedBy: number): Promise<Client>;
    remove(id: number): Promise<void>;
    getClientStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        bySegment: {
            segmentId: number;
            count: number;
        }[];
    }>;
}
