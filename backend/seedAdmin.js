const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gumnam-momina';

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String, phone: String, cart: []
});

const User = mongoose.model('User', userSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB...');

  // Remove old admin
  await User.deleteOne({ email: 'admin@gumnammomina.pk' });

  const hashedPassword = await bcrypt.hash('admin123456', 12);
  await User.create({
    name: 'Admin',
    email: 'admin@gumnammomina.pk',
    password: hashedPassword,
    role: 'admin',
    phone: '+92 300 0000000'
  });

  console.log('✅ Admin user created!');
  console.log('📧 Email: admin@gumnammomina.pk');
  console.log('🔑 Password: admin123456');
  console.log('⚠️  Change the password after first login!');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
