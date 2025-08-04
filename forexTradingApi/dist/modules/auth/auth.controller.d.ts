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
    login(loginDto: LoginDto): Promise<{
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
    getProfile(req: AuthenticatedRequest): Promise<{
        id: number;
        username: string;
        fullName: string;
        profileId: number;
        salesGroupId: number | null;
        status: "activo" | "inactivo";
    }>;
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
