const bcrypt = require('bcrypt');

// Función para generar hashes
async function generatePasswordHash(password, rounds = 12) {
  try {
    const hash = await bcrypt.hash(password, rounds);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
}

// Función principal
async function main() {
  console.log('🔐 Generador de Hashes de Contraseñas para PriceFlowFX');
  console.log('='.repeat(60));
  
  // Contraseñas por defecto para usuarios iniciales
  const passwords = [
    { user: 'admin', password: 'admin123!' },
    { user: 'trader01', password: 'trader123!' },
    { user: 'sales01', password: 'sales123!' },
    { user: 'manager01', password: 'manager123!' },
    { user: 'viewer01', password: 'viewer123!' },
  ];

  console.log('\n📋 Hashes generados (rounds=12):');
  console.log('-'.repeat(40));

  for (const { user, password } of passwords) {
    const hash = await generatePasswordHash(password, 12);
    console.log(`\n👤 Usuario: ${user}`);
    console.log(`🔑 Password: ${password}`);
    console.