import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        username: string;
        fullName: string;
        profileId: number;
        salesGroupId: number | null;
        status: string;
    };
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<import("./auth.service").LoginResponse>;
    getProfile(req: AuthenticatedRequest): Promise<import("./auth.service").AuthUser>;
    validateToken(req: AuthenticatedRequest): Promise<{
        valid: boolean;
        user: {
            id: number;
            username: string;
            fullName: string;
        };
    }>;
}
export {};
