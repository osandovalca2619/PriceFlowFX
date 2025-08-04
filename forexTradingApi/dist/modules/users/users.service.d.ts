import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByUsernameWithPassword(username: string): Promise<User | null>;
    findActiveUsers(): Promise<User[]>;
    findByProfileId(profileId: number): Promise<User[]>;
    findBySalesGroupId(salesGroupId: number): Promise<User[]>;
    update(id: number, updateUserDto: UpdateUserDto, modifiedBy: number): Promise<User>;
    deactivateUser(id: number, modifiedBy: number): Promise<User>;
    activateUser(id: number, modifiedBy: number): Promise<User>;
    remove(id: number): Promise<void>;
    validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
