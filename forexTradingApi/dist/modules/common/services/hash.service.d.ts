import { ConfigService } from '@nestjs/config';
export declare class HashService {
    private configService;
    private readonly saltRounds;
    constructor(configService: ConfigService);
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
    generateHash(password: string, rounds?: number): Promise<string>;
    validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
        score: number;
    };
}
