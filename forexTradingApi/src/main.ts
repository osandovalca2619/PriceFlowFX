// forexTradingApi/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir conexiones desde el frontend
  app.enableCors({
    origin: [
      'http://localhost:3001', // Puerto típico de Next.js
      'http://localhost:3000', // En caso de que uses otro puerto
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL || 'http://localhost:3001' // URL del frontend desde env
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept',
      'Origin',
      'X-Requested-With'
    ],
    credentials: true, // Permitir cookies y headers de autenticación
  });

  // Configurar adaptador para WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // Pipeline de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Eliminar propiedades no definidas en los DTOs
    forbidNonWhitelisted: true, // Lanzar error si hay propiedades extra
    transform: true, // Transformar automáticamente los tipos
  }));

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('PriceFlowFX API')
    .setDescription('Real-time Forex Trading API with WebSocket support')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('currencies', 'Currency management')
    .addTag('websocket', 'WebSocket price feeds')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001; // Cambié a 3001 para que coincida con tu .env
  
  await app.listen(port);
  
  console.log(`🚀 PriceFlowFX API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
  console.log(`🔌 WebSocket namespace: /prices`);
}

// ¡ESTO ES LO QUE FALTABA! - Ejecutar la función bootstrap
bootstrap().catch(err => {
  console.error('Error starting the application:', err);
  process.exit(1);
});