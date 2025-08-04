import type { Request as ExpressRequest } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, req: AuthenticatedRequest): Promise<import("./entities/user.entity").User>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    findActiveUsers(): Promise<import("./entities/user.entity").User[]>;
    findByProfileId(profileId: number): Promise<import("./entities/user.entity").User[]>;
    findBySalesGroupId(salesGroupId: number): Promise<import("./entities/user.entity").User[]>;
    findOne(id: number): Promise<import("./entities/user.entity").User>;
    update(id: number, updateUserDto: UpdateUserDto, req: AuthenticatedRequest): Promise<import("./entities/user.entity").User>;
    deactivateUser(id: number, req: AuthenticatedRequest): Promise<import("./entities/user.entity").User>;
    activateUser(id: number, req: AuthenticatedRequest): Promise<import("./entities/user.entity").User>;
    remove(id: number): Promise<void>;
}
export {};
