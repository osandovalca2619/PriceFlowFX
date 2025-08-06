import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashService } from '../common/services/hash.service';
export declare class UsersService {
    private usersRepository;
    private userProfileRepository;
    private hashService;
    constructor(usersRepository: Repository<User>, userProfileRepository: Repository<UserProfile>, hashService: HashService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByUsername(username: string): Promise<User | null>;
    findByUsernameWithPassword(username: string): Promise<User | null>;
    findByIdWithPassword(id: number): Promise<User | null>;
    findActiveUsers(): Promise<User[]>;
    findByProfileId(profileId: number): Promise<User[]>;
    findBySalesGroupId(salesGroupId: number): Promise<User[]>;
    update(id: number, updateUserDto: UpdateUserDto, modifiedBy: number): Promise<User>;
    updatePassword(id: number, newPassword: string, modifiedBy: number): Promise<void>;
    deactivateUser(id: number, modifiedBy: number): Promise<User>;
    activateUser(id: number, modifiedBy: number): Promise<User>;
    remove(id: number): Promise<void>;
    validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    getAllProfiles(): Promise<UserProfile[]>;
    getProfileById(id: number): Promise<UserProfile | null>;
}
