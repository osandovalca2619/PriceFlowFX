"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const common_module_1 = require("./modules/common/common.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const products_module_1 = require("./modules/products/products.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const currencies_module_1 = require("./modules/currencies/currencies.module");
const websocket_module_1 = require("./modules/websocket/websocket.module");
const health_module_1 = require("./modules/health/health.module");
const clients_module_1 = require("./modules/clients/clients.module");
const books_module_1 = require("./modules/books/books.module");
const operations_module_1 = require("./modules/operations/operations.module");
const spreads_module_1 = require("./modules/spreads/spreads.module");
const catalogs_module_1 = require("./modules/catalogs/catalogs.module");
const database_config_1 = require("./config/database.config");
let AppModule = class AppModule {
    configService;
    constructor(configService) {
        this.configService = configService;
        this.validateEnvironment();
    }
    validateEnvironment() {
        const requiredEnvVars = [
            'DATABASE_URL',
            'JWT_SECRET',
        ];
        const missingVars = requiredEnvVars.filter((varName) => !this.configService.get(varName));
        if (missingVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
        }
        const jwtSecret = this.configService.get('JWT_SECRET');
        if (jwtSecret && jwtSecret.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters long');
        }
        console.log('✅ Environment variables validated successfully');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationOptions: {
                    allowUnknown: true,
                    abortEarly: true,
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: 'medium',
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: 'long',
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            transactions_module_1.TransactionsModule,
            currencies_module_1.CurrenciesModule,
            websocket_module_1.WebSocketModule,
            health_module_1.HealthModule,
            clients_module_1.ClientsModule,
            books_module_1.BooksModule,
            operations_module_1.OperationsModule,
            spreads_module_1.SpreadsModule,
            catalogs_module_1.CatalogsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
//# sourceMappingURL=app.module.js.map