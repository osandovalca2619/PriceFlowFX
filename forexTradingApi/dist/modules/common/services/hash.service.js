"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
let HashService = class HashService {
    configService;
    saltRounds;
    constructor(configService) {
        this.configService = configService;
        this.saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS', '12'), 10);
    }
    async hashPassword(password) {
        return bcrypt.hash(password, this.saltRounds);
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async generateHash(password, rounds) {
        const saltRounds = rounds || this.saltRounds;
        return bcrypt.hash(password, saltRounds);
    }
    validatePasswordStrength(password) {
        const errors = [];
        let score = 0;
        if (password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }
        else {
            score += 20;
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra mayúscula');
        }
        else {
            score += 20;
        }
        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra minúscula');
        }
        else {
            score += 20;
        }
        if (!/\d/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        }
        else {
            score += 20;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        }
        else {
            score += 20;
        }
        if (password.length > 12) {
            score += 10;
        }
        return {
            isValid: errors.length === 0,
            errors,
            score: Math.min(score, 100),
        };
    }
};
exports.HashService = HashService;
exports.HashService = HashService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], HashService);
//# sourceMappingURL=hash.service.js.map