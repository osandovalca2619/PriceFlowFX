import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private readonly saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds = parseInt(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
      10,
    );
  }

  /**
   * Hashea una contraseña usando bcrypt
   * @param password Contraseña en texto plano
   * @returns Promise con la contraseña hasheada
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con su hash
   * @param password Contraseña en texto plano
   * @param hash Hash almacenado en la base de datos
   * @returns Promise<boolean> true si coinciden
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Genera un hash para una contraseña específica (útil para testing/seeds)
   * @param password Contraseña a hashear
   * @param rounds Número de rounds (opcional, usa la configuración por defecto)
   * @returns Promise con el hash generado
   */
  async generateHash(password: string, rounds?: number): Promise<string> {
    const saltRounds = rounds || this.saltRounds;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Valida la fortaleza de una contraseña
   * @param password Contraseña a validar
   * @returns Objeto con el resultado de la validación
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    score: number; // 0-100
  } {
    const errors: string[] = [];
    let score = 0;

    // Longitud mínima
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    } else {
      score += 20;
    }

    // Contiene mayúsculas
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    } else {
      score += 20;
    }

    // Contiene minúsculas
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    } else {
      score += 20;
    }

    // Contiene números
    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    } else {
      score += 20;
    }

    // Contiene caracteres especiales
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    } else {
      score += 20;
    }

    // Bonus por longitud extra
    if (password.length > 12) {
      score += 10;
    }

    return {
      isValid: errors.length === 0,
      errors,
      score: Math.min(score, 100),
    };
  }
}