<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# PriceFlowFX API - Backend

API REST construida con NestJS que proporciona endpoints para la aplicación de trading de forex. Utiliza TypeORM para la persistencia de datos con PostgreSQL en Supabase.

## 🚀 Características

- **API REST**: Endpoints para usuarios, productos, transacciones y monedas
- **Autenticación**: JWT-based authentication
- **Base de Datos**: PostgreSQL con TypeORM
- **Documentación**: Swagger/OpenAPI
- **Validación**: DTOs con class-validator
- **Logging**: Configuración de logs estructurados

## 🛠️ Tecnologías Utilizadas

- **Backend**: NestJS, TypeScript
- **Base de Datos**: PostgreSQL, TypeORM
- **Autenticación**: JWT
- **Documentación**: Swagger
- **Validación**: class-validator, class-transformer

## 📋 Prerrequisitos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)
- Base de datos PostgreSQL en Supabase

## 🚀 Configuración y Instalación

### 1. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:

```env
# Database Configuration (Supabase)
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_NAME=postgres

# Application Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. Obtener Credenciales de Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **Settings** > **Database**
3. Copia los siguientes valores:
   - **Host**: `db.your-project-ref.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: Tu contraseña de base de datos

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar Migraciones (Opcional)

Si tienes migraciones configuradas:

```bash
npm run typeorm:migration:run
```

### 5. Ejecutar la Aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

La API estará disponible en: **http://localhost:3001**

## 📁 Estructura del Proyecto

```
app/
├── src/
│   ├── config/           # Configuraciones (TypeORM, etc.)
│   ├── modules/          # Módulos de la aplicación
│   │   ├── auth/         # Autenticación
│   │   ├── users/        # Gestión de usuarios
│   │   ├── products/     # Productos
│   │   ├── transactions/ # Transacciones
│   │   └── currencies/   # Monedas
│   ├── shared/           # Utilidades compartidas
│   ├── app.module.ts     # Módulo principal
│   └── main.ts           # Punto de entrada
├── test/                 # Tests
├── package.json          # Dependencias
└── tsconfig.json         # Configuración TypeScript
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Inicia en modo desarrollo con hot reload
npm run start:debug      # Inicia en modo debug

# Producción
npm run build           # Construye la aplicación
npm run start:prod      # Inicia en modo producción

# Testing
npm run test            # Ejecuta tests unitarios
npm run test:e2e        # Ejecuta tests end-to-end
npm run test:cov        # Tests con cobertura

# Database
npm run typeorm:migration:generate -- -n MigrationName
npm run typeorm:migration:run
npm run typeorm:migration:revert

# Linting
npm run lint            # Ejecuta ESLint
npm run format          # Formatea código con Prettier
```

## 🔗 Endpoints de la API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /auth/profile` - Obtener perfil

### Usuarios
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Productos
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

### Transacciones
- `GET /transactions` - Listar transacciones
- `GET /transactions/:id` - Obtener transacción
- `POST /transactions` - Crear transacción

### Monedas
- `GET /currencies` - Listar monedas
- `GET /currencies/:id` - Obtener moneda
- `POST /currencies` - Crear moneda
- `PUT /currencies/:id` - Actualizar moneda
- `DELETE /currencies/:id` - Eliminar moneda

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación Swagger en:

**http://localhost:3001/api**

## 🔧 Configuración de CORS

La API está configurada para aceptar peticiones desde el frontend. Si necesitas cambiar la configuración de CORS, modifica el archivo `main.ts`:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

1. **Verificar credenciales**: Asegúrate de que las credenciales en `.env` sean correctas
2. **Verificar red**: Asegúrate de tener conexión a internet
3. **Verificar SSL**: En producción, Supabase requiere SSL

### Error de puerto ocupado

Si el puerto 3001 está ocupado, cambia el puerto en el archivo `.env`:

```env
PORT=3002
```

### Error de migraciones

Si hay problemas con las migraciones:

```bash
# Revertir última migración
npm run typeorm:migration:revert

# Generar nueva migración
npm run typeorm:migration:generate -- -n FixMigration
```

## 🔒 Seguridad

- **JWT**: Usa un secreto fuerte para JWT_SECRET
- **CORS**: Configura correctamente los orígenes permitidos
- **Validación**: Todos los endpoints validan los datos de entrada
- **Rate Limiting**: Considera implementar rate limiting en producción

## 📝 Notas de Desarrollo

- La aplicación usa TypeORM con PostgreSQL
- Los errores de TypeScript se ignoran durante el build para facilitar el desarrollo
- Se recomienda usar ESLint y Prettier para mantener el código limpio
- Los logs se configuran automáticamente según el entorno

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

¡Disfruta desarrollando tu API de trading de forex! 🚀
