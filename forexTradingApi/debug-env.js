// Archivo: forexTradingApi/debug-env.js
// Script para verificar que las variables de entorno se estén leyendo correctamente

require('dotenv').config();

console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO');
console.log('=' .repeat(50));

console.log('\n📋 Variables de entorno encontradas:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET existe:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET longitud:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

console.log('\n🔐 Variables de base de datos:');
console.log('SUPABASE_DB_PASSWORD existe:', !!process.env.SUPABASE_DB_PASSWORD);
console.log('SUPABASE_DB_PASSWORD tipo:', typeof process.env.SUPABASE_DB_PASSWORD);
console.log('SUPABASE_DB_PASSWORD longitud:', process.env.SUPABASE_DB_PASSWORD ? process.env.SUPABASE_DB_PASSWORD.length : 0);

if (process.env.SUPABASE_DB_PASSWORD) {
    console.log('SUPABASE_DB_PASSWORD primeros 3 chars:', process.env.SUPABASE_DB_PASSWORD.substring(0, 3) + '***');
} else {
    console.log('❌ SUPABASE_DB_PASSWORD NO ENCONTRADA');
}

console.log('\n🔗 DATABASE_URL existe:', !!process.env.DATABASE_URL);

console.log('\n📁 Directorio actual:', process.cwd());
console.log('📄 Archivo .env existe:', require('fs').existsSync('.env'));

if (require('fs').existsSync('.env')) {
    console.log('📄 Contenido del archivo .env (primeras líneas):');
    const envContent = require('fs').readFileSync('.env', 'utf8');
    const lines = envContent.split('\n').slice(0, 5);
    lines.forEach((line, index) => {
        if (line.includes('PASSWORD')) {
            console.log(`${index + 1}: ${line.substring(0, 20)}***`);
        } else {
            console.log(`${index + 1}: ${line}`);
        }
    });
}