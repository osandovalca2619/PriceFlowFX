"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => {
    const databaseUrl = configService.get('DATABASE_URL');
    if (databaseUrl) {
        console.log('✅ Usando DATABASE_URL para conexión');
        return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: configService.get('NODE_ENV') === 'development',
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
    const dbPassword = configService.get('SUPABASE_DB_PASSWORD');
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
        logging: configService.get('NODE_ENV') === 'development',
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
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map