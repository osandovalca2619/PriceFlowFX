import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../common/services/hash.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
export interface AuthUser {
    id: number;
    username: string;
    fullName: string;
    profileId: number;
    profileName: string;
    salesGroupId: number | null;
    status: string;
}
export interface LoginResponse {
    access_token: string;
    user: AuthUser;
    expires_in: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private hashService;
    constructor(usersService: UsersService, jwtService: JwtService, hashService: HashService);
    validateUser(username: string, password: string): Promise<AuthUser | null>;
    login(username: string, password: string): Promise<LoginResponse>;
    register(createUserDto: CreateUserDto, createdBy: number): Promise<AuthUser>;
    validateUserById(userId: number): Promise<AuthUser>;
    getProfile(userId: number): Promise<AuthUser>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    verifyToken(token: string): Promise<any>;
}
