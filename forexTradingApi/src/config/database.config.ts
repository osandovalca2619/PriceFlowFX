import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  // Usar directamente la DATABASE_URL si está disponible
  const databaseUrl = configService.get<string>('DATABASE_URL');
  
  if (databaseUrl) {
    console.log('✅ Usando DATABASE_URL para conexión');
    return {
      type: 'postgres',
      url: databaseUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: configService.get<string>('NODE_ENV') === 'development',
      ssl: {
        rejectUnauthorized: false,
      },
      extra: {
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      },
    };
  }

  // Fallback a configuración manual
  const dbPassword = configService.get<string>('SUPABASE_DB_PASSWORD');
  
  console.log('✅ Usando configuración manual');
  console.log('🔐 Password type:', typeof dbPassword);
  console.log('🔐 Password length:', dbPassword?.length || 0);

  return {
    type: 'postgres',
    host: 'db.khtlxglpwkcmtmqtvrtr.supabase.co',
    port: 5432,
    username: 'postgres',
    password: dbPassword,
    database: 'postgres',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: {
      rejectUnauthorized: false,
    },
    extra: {
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    },
  };
};