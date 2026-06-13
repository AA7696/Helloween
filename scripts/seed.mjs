// Seed the MongoDB database with the admin user + product catalog.
// Run with: npm run seed
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Load .env.local manually (no Next runtime here).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
try {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
} catch {
  console.warn('Could not read .env.local — relying on existing env vars.');
}

const { defaultProducts } = await import('../src/lib/seedData.js');

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'helladmin123';

const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users' });
const productSchema = new mongoose.Schema({}, { strict: false, collection: 'products' });

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Seed: connected to MongoDB.');

  const User = mongoose.model('User', userSchema);
  const Product = mongoose.model('Product', productSchema);

  await User.deleteMany({});
  const hashed = bcrypt.hashSync(ADMIN_PASSWORD, bcrypt.genSaltSync(10));
  await User.create({ name: 'Administrator', username: ADMIN_USERNAME, password: hashed, role: 'admin', createdAt: new Date() });
  console.log(`Seed: admin created (username: ${ADMIN_USERNAME} / password: ${ADMIN_PASSWORD}).`);

  // Make sure indexes match the current schema (email/username unique+sparse).
  await User.collection.dropIndexes().catch(() => {});

  await Product.deleteMany({});
  await Product.insertMany(defaultProducts.map((p) => ({ ...p, createdAt: new Date() })));
  console.log(`Seed: populated ${defaultProducts.length} products.`);

  console.log('Seed: done.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
