import { MongoClient } from 'mongodb';

process.loadEnvFile(new URL('../.env.local', import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ ไม่พบ MONGODB_URI ใน .env.local');
  process.exit(1);
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256
  );
  const toHex = (arr) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${toHex(salt)}:${toHex(new Uint8Array(bits))}`;
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#%^&*';
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

// ส่งรหัสผ่านใหม่เป็น argument ได้ เช่น: node scripts/create-admin.mjs 'MyNewPass123!'
// ไม่ระบุ = สุ่มรหัสผ่านที่ปลอดภัยให้อัตโนมัติ
const NEW_PASSWORD = process.argv[2] || generatePassword();

const client = new MongoClient(MONGODB_URI);
await client.connect();

const db = client.db();
const col = db.collection('adminusers');

const users = await col.find({}, { projection: { username: 1, displayName: 1, role: 1 } }).toArray();
console.log('\n📋 Admin users ที่มีอยู่:');
users.forEach(u => console.log(`   - ${u.username} (${u.displayName}) [${u.role}]`));

// reset รหัสผ่านของ admin คนแรก
const target = users.find(u => u.role === 'super') ?? users[0];
if (target) {
  const passwordHash = await hashPassword(NEW_PASSWORD);
  await col.updateOne({ _id: target._id }, { $set: { passwordHash } });
  console.log(`\n✅ Reset รหัสผ่านสำเร็จ`);
  console.log(`   username : ${target.username}`);
  console.log(`   password : ${NEW_PASSWORD}`);
  console.log(`   role     : ${target.role}`);
}

await client.close();
