import jwt from 'jsonwebtoken';
const secret = 'E$3cr3tD3bUgg3rS3@Ts@In6am2024XX';

const tokenUsuario = jwt.sign(
    { sub: 'user-001', role: 'USER_ROLE' },
    secret,
    { expiresIn: '24h', audience: 'feelWell', issuer: 'feelWell' }
);
const tokenAdmin = jwt.sign(
    { sub: 'admin-001', role: 'ADMIN_ROLE' },
    secret,
    { expiresIn: '24h', audience: 'feelWell', issuer: 'feelWell' }
);
const tokenAdminMood = jwt.sign(
    { sub: 'admin-mood-001', role: 'admin-MoodTracking' },
    secret,
    { expiresIn: '24h', audience: 'feelWell', issuer: 'feelWell' }
);

// ← Estas líneas faltaban
console.log('USUARIO:\n', tokenUsuario);
console.log('\nADMIN GENERAL:\n', tokenAdmin);
console.log('\nADMIN MOOD TRACKING:\n', tokenAdminMood);