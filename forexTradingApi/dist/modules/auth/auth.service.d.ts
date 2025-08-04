import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            fullName: any;
            profileId: any;
            salesGroupId: any;
            status: any;
        };
    }>;
    validateUserById(userId: number): Promise<any>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        fullName: string;
        profileId: number;
        salesGroupId: number | null;
        status: "activo" | "inactivo";
    }>;
}
