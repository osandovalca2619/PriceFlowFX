"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: [
            'http://localhost:3001',
            'http://localhost:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:3000',
            process.env.FRONTEND_URL || 'http://localhost:3001'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With'
        ],
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('PriceFlowFX API')
        .setDescription('Real-time Forex Trading API with WebSocket support')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
    }, 'JWT-auth')
        .addTag('auth', 'Authentication endpoints')
        .addTag('currencies', 'Currency management')
        .addTag('websocket', 'WebSocket price feeds')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 PriceFlowFX API is running on: http://localhost:${port}`);
    console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
    console.log(`🔌 WebSocket namespace: /prices`);
}
bootstrap().catch(err => {
    console.error('Error starting the application:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map