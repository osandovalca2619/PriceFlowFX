import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// Modules
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { CurrenciesModule } from './modules/currencies/currencies.module'; // ¡Agregamos esto!
import { WebSocketModule } from './modules/websocket/websocket.module';
import { HealthModule } from './modules/health/health.module'; // ✅ AGREGADO

// Database Configuration
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),

    // Schedule para cron jobs del WebSocket
    ScheduleModule.forRoot(),

    // Rate Limiting (protección contra ataques de fuerza bruta)
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 segundo
        limit: 3,  // 3 requests por segundo
      },
      {
        name: 'medium',
        ttl: 10000, // 10 segundos
        limit: 20,  // 20 requests por 10 segundos
      },
      {
        name: 'long',
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    CommonModule,        // ✅ Servicios comunes (HashService)
    AuthModule,          // ✅ Autenticación
    UsersModule,         // ✅ Gestión de usuarios
    ProductsModule,      // ✅ Gestión de productos
    TransactionsModule,  // ✅ Gestión de transacciones
    CurrenciesModule,    // ✅ Gestión de divisas (AGREGADO)
    WebSocketModule,     // ✅ WebSocket para precios en tiempo real
    HealthModule,        // ✅ AGREGADO: Health checks
  ],
  
  providers: [
    // Rate limiting global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    // Validar variables de entorno críticas al inicio
    this.validateEnvironment();
  }

  private validateEnvironment() {
    const requiredEnvVars = [
      'DATABASE_URL', // Cambiamos para usar tu variable actual
      'JWT_SECRET',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !this.configService.get(varName),
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`,
      );
    }

    // Validar que JWT_SECRET sea suficientemente fuerte
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (jwtSecret && jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    console.log('✅ Environment variables validated successfully');
  }
}