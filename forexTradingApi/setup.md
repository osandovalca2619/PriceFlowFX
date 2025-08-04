# 🚀 Configuración Rápida del Backend

## Pasos para configurar el backend con Supabase

### 1. Crear archivo de variables de entorno

```bash
# En la carpeta app/
cp env.example .env
```

### 2. Configurar credenciales de Supabase

Edita el archivo `.env` con tus credenciales:

```env
# Reemplaza con tus credenciales reales de Supabase
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu-contraseña-real
DB_NAME=postgres

PORT=3001
NODE_ENV=development
JWT_SECRET=tu-secreto-jwt-super-seguro
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Probar conexión a la base de datos

```bash
npm run start:dev
```

### 5. Verificar que la API esté funcionando

- Ve a: http://localhost:3001
- Deberías ver un mensaje de bienvenida de NestJS

### 6. Documentación de la API

- Swagger UI: http://localhost:3001/api

## 🔧 Obtener credenciales de Supabase

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **Database**
4. Copia los valores de **Connection string** o **Connection pooling**

### Ejemplo de configuración:

```
Host: db.abcdefghijklmnop.supabase.co
Database: postgres
Port: 5432
User: postgres
Password: tu-contraseña-de-base-de-datos
```

## 🐛 Solución de problemas comunes

### Error de conexión SSL
Si tienes problemas con SSL, asegúrate de que en producción tengas:
```typescript
ssl: { rejectUnauthorized: false }
```

### Error de puerto ocupado
Cambia el puerto en `.env`:
```env
PORT=3002
```

### Error de CORS
Verifica que el frontend esté en el puerto correcto:
```env
CORS_ORIGIN=http://localhost:3000
```

## ✅ Verificación final

1. ✅ Backend corriendo en http://localhost:3001
2. ✅ Frontend corriendo en http://localhost:3000
3. ✅ Conexión a Supabase establecida
4. ✅ CORS configurado correctamente

¡Tu aplicación está lista! 🎉 