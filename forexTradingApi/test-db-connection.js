// Archivo: forexTradingApi/test-db-connection.js
// Script para probar la conexión directa a Supabase

require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  console.log('🔍 PROBANDO CONEXIÓN DIRECTA A SUPABASE');
  console.log('=' .repeat(50));

  const password = process.env.SUPABASE_DB_PASSWORD;
  const databaseUrl = process.env.DATABASE_URL;

  console.log('\n📋 Configuración de conexión:');
  console.log('Password existe:', !!password);
  console.log('Password tipo:', typeof password);
  console.log('Password longitud:', password ? password.length : 0);
  console.log('DATABASE_URL existe:', !!databaseUrl);

  // Prueba 1: Conexión con DATABASE_URL
  if (databaseUrl) {
    console.log('\n🧪 PRUEBA 1: Conexión con DATABASE_URL');
    try {
      const client = new Client({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await client.connect();
      console.log('✅ Conexión exitosa con DATABASE_URL');
      
      const result = await client.query('SELECT NOW() as current_time');
      console.log('✅ Query test exitosa:', result.rows[0]);
      
      await client.end();
    } catch (error) {
      console.log('❌ Error con DATABASE_URL:', error.message);
    }
  }

  // Prueba 2: Conexión manual
  console.log('\n🧪 PRUEBA 2: Conexión manual');
  try {
    const client = new Client({
      host: 'db.khtlxglpwkcmtmqtvrtr.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: password,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();
    console.log('✅ Conexión exitosa con configuración manual');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Query test exitosa:', result.rows[0]);
    
    await client.end();
  } catch (error) {
    console.log('❌ Error con configuración manual:', error.message);
  }
}

testConnection().catch(console.error);