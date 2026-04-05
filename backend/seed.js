const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gumnam-momina';

// ── Schemas (inline so this file is self-contained) ─────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  role: { type: String, default: 'user' },
  phone: String, cart: [],
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String, description: String,
  price: Number, originalPrice: Number,
  category: { type: String, enum: ['Abaya','Hijab','Namaz Chadar','Accessories','Gift Sets','Kids'] },
  images: [String], sizes: [String], colors: [String],
  material: String, stock: Number,
  isAvailable: { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  isNewArrival:{ type: Boolean, default: false },
  tags: [String],
  ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  reviews: [],
}, { timestamps: true });

const User    = mongoose.model('User',    userSchema);
const Product = mongoose.model('Product', productSchema);

// ── Products Data ────────────────────────────────────────────────────────────
const products = [

  // ── ABAYAS ──────────────────────────────────────────────────────────────
  {
    name: 'Midnight Rose Abaya',
    description: 'Elegant black abaya crafted from premium Korean nida with delicate rose embroidery on cuffs and hem. Flows beautifully with a relaxed silhouette. Perfect for everyday wear and special occasions.',
    price: 4500, originalPrice: 5500,
    category: 'Abaya',
    images: [
      'https://images.unsplash.com/photo-1585241936939-be4099591252?w=600&q=80',
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80',
    ],
    sizes: ['S','M','L','XL','XXL'],
    colors: ['Black','Midnight Navy'],
    material: 'Korean Nida', stock: 30,
    isFeatured: true, isNewArrival: true,
    tags: ['bestseller','embroidered','nida','everyday'],
    ratings: { average: 4.8, count: 42 },
  },
  {
    name: 'Butterfly Open Abaya',
    description: 'Flowy butterfly-style open abaya with wide sleeves, perfect for layering. Modern modest design in premium crepe fabric. A wardrobe staple for the contemporary Muslim woman.',
    price: 3800,
    category: 'Abaya',
    images: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80',
    ],
    sizes: ['XS','S','M','L','XL','XXL'],
    colors: ['Black','Brown','Grey','Dusty Rose'],
    material: 'Crepe', stock: 25,
    isFeatured: true, isNewArrival: false,
    tags: ['butterfly','open abaya','layering','crepe'],
    ratings: { average: 4.6, count: 28 },
  },
  {
    name: 'Pearl Embroidered Abaya',
    description: 'Luxury abaya adorned with hand-stitched pearl and crystal embroidery on the chest and cuffs. Crafted from soft Japanese crepe. Ideal for weddings, Eid, and formal events.',
    price: 7200, originalPrice: 8500,
    category: 'Abaya',
    images: [
      'https://images.unsplash.com/photo-1566479179817-6a0c3e853c27?w=600&q=80',
    ],
    sizes: ['S','M','L','XL'],
    colors: ['Black','Ivory','Champagne'],
    material: 'Japanese Crepe', stock: 15,
    isFeatured: true, isNewArrival: false,
    tags: ['luxury','pearl','embroidery','wedding','eid'],
    ratings: { average: 5.0, count: 19 },
  },
  {
    name: 'Linen Summer Abaya',
    description: 'Breathable linen blend abaya perfect for warm weather. Relaxed fit with subtle pintuck details. Lightweight and comfortable for all-day wear.',
    price: 3200,
    category: 'Abaya',
    images: [
      'https://images.unsplash.com/photo-1612831455359-970e23a1e4e9?w=600&q=80',
    ],
    sizes: ['S','M','L','XL','XXL'],
    colors: ['White','Sand','Olive','Dusty Blue'],
    material: 'Linen Blend', stock: 35,
    isFeatured: false, isNewArrival: true,
    tags: ['summer','linen','breathable','casual'],
    ratings: { average: 4.5, count: 14 },
  },
  {
    name: 'Velvet Luxury Abaya',
    description: 'Statement velvet abaya with a structured silhouette and subtle sheen. Features a hidden button placket and tailored cuffs. For the woman who commands attention wherever she goes.',
    price: 6500, originalPrice: 7800,
    category: 'Abaya',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4ebe?w=600&q=80',
    ],
    sizes: ['S','M','L','XL'],
    colors: ['Burgundy','Emerald','Midnight Black'],
    material: 'Premium Velvet', stock: 12,
    isFeatured: true, isNewArrival: false,
    tags: ['velvet','luxury','structured','formal'],
    ratings: { average: 4.9, count: 31 },
  },

  // ── HIJABS ──────────────────────────────────────────────────────────────
  {
    name: 'Golden Chiffon Hijab',
    description: 'Luxurious chiffon hijab with delicate gold thread woven throughout. Incredibly lightweight and breathable. Drapes beautifully and stays in place all day.',
    price: 1200, originalPrice: 1500,
    category: 'Hijab',
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Ivory Gold','Blush Gold','Champagne'],
    material: 'Premium Chiffon', stock: 50,
    isFeatured: true, isNewArrival: false,
    tags: ['chiffon','gold thread','elegant','wedding'],
    ratings: { average: 4.7, count: 63 },
  },
  {
    name: 'Embroidered Khimar',
    description: 'Statement khimar with exquisite hand-done floral embroidery along the edges. Made from flowing crepe with a structured crown. Modest, striking, and incredibly beautiful.',
    price: 3200,
    category: 'Hijab',
    images: [
      'https://images.unsplash.com/photo-1563746924237-f81d813e4a97?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Black','White','Teal','Burgundy'],
    material: 'Crepe with Hand Embroidery', stock: 18,
    isFeatured: true, isNewArrival: true,
    tags: ['khimar','embroidered','statement','modest'],
    ratings: { average: 4.8, count: 22 },
  },
  {
    name: 'Jersey Everyday Hijab',
    description: 'Soft jersey hijab that stays put without pins. Stretchy, comfortable, and non-slip. Your go-to for busy days when you need effortless coverage.',
    price: 650,
    category: 'Hijab',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Black','White','Nude','Navy','Grey','Dusty Pink','Olive'],
    material: 'Cotton Jersey', stock: 100,
    isFeatured: false, isNewArrival: false,
    tags: ['jersey','everyday','no-pin','comfortable','basics'],
    ratings: { average: 4.6, count: 89 },
  },
  {
    name: 'Silk Satin Hijab',
    description: 'Luxurious silk-feel satin hijab with a beautiful drape and subtle sheen. Perfect for formal events, engagements, and Eid celebrations. Comes in a gift pouch.',
    price: 1800, originalPrice: 2200,
    category: 'Hijab',
    images: [
      'https://images.unsplash.com/photo-1558171813-4882e820028b?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Blush','Lavender','Ivory','Rose Gold','Sage Green'],
    material: 'Silk Satin', stock: 40,
    isFeatured: false, isNewArrival: true,
    tags: ['silk','satin','formal','eid','gift'],
    ratings: { average: 4.7, count: 35 },
  },

  // ── NAMAZ CHADAR ─────────────────────────────────────────────────────────
  {
    name: 'Velvet Namaz Chadar',
    description: 'Soft premium velvet prayer chadar with intricate Islamic geometric patterns embroidered in gold thread. Generous size for full coverage. Comes beautifully packaged.',
    price: 2800,
    category: 'Namaz Chadar',
    images: [
      'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Emerald Green','Burgundy','Navy Blue','Black','Royal Purple'],
    material: 'Premium Velvet', stock: 30,
    isFeatured: true, isNewArrival: false,
    tags: ['velvet','prayer','gift','geometric','gold embroidery'],
    ratings: { average: 4.9, count: 47 },
  },
  {
    name: 'Cotton Printed Prayer Set',
    description: 'Soft cotton prayer chadar with a matching prayer cap. Beautiful floral and paisley print. Breathable and comfortable for extended prayers. Machine washable.',
    price: 1500,
    category: 'Namaz Chadar',
    images: [
      'https://images.unsplash.com/photo-1585128792020-803d29415281?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['White Floral','Pink Paisley','Blue Garden'],
    material: 'Pure Cotton', stock: 45,
    isFeatured: false, isNewArrival: true,
    tags: ['cotton','prayer set','cap included','printed','washable'],
    ratings: { average: 4.5, count: 28 },
  },
  {
    name: 'Luxury Embroidered Janamaz',
    description: 'Heirloom-quality prayer rug and chadar set with hand-embroidered Kaaba motif. Made from finest wool with silk thread embroidery. A treasured gift for any occasion.',
    price: 4200, originalPrice: 5000,
    category: 'Namaz Chadar',
    images: [
      'https://images.unsplash.com/photo-1567880905822-56f8e06fe630?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Forest Green','Deep Red','Midnight Blue'],
    material: 'Wool with Silk Embroidery', stock: 20,
    isFeatured: true, isNewArrival: false,
    tags: ['luxury','janamaz','rug set','kaaba','heirloom','gift'],
    ratings: { average: 5.0, count: 16 },
  },

  // ── ACCESSORIES ──────────────────────────────────────────────────────────
  {
    name: 'Pearl Tasbih — 99 Beads',
    description: 'Handcrafted 99-bead tasbih with genuine freshwater pearl beads and an 18k gold-plated clasp. Each bead individually knotted. Packaged in a velvet gift box.',
    price: 1800,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['White Pearl','Blush Pearl','Lavender Pearl'],
    material: 'Freshwater Pearl', stock: 40,
    isFeatured: true, isNewArrival: false,
    tags: ['tasbih','pearl','99 beads','gift','gold clasp'],
    ratings: { average: 4.9, count: 54 },
  },
  {
    name: 'Oud Attar Gift Set',
    description: 'Exquisite collection of 4 pure oud-based attars in ornate glass bottles. Includes Oud Rose, Oud Amber, Oud Musk, and Black Oud. Alcohol-free. Perfect gift.',
    price: 3500,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1590156206657-aec4d5a84694?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Gold Set'],
    material: 'Pure Oud Oil', stock: 25,
    isFeatured: false, isNewArrival: true,
    tags: ['attar','oud','perfume','alcohol-free','gift set'],
    ratings: { average: 4.8, count: 31 },
  },
  {
    name: 'Islamic Wall Art Calligraphy',
    description: 'Handcrafted resin calligraphy wall art with Ayat ul Kursi. Gold finish on white. Ready to hang. Each piece is slightly unique as it is hand-poured.',
    price: 2200,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Gold on White','Gold on Black'],
    material: 'Hand-poured Resin', stock: 15,
    isFeatured: false, isNewArrival: true,
    tags: ['calligraphy','wall art','ayat ul kursi','home decor','resin'],
    ratings: { average: 4.7, count: 18 },
  },

  // ── GIFT SETS ─────────────────────────────────────────────────────────────
  {
    name: 'Ramadan Luxury Gift Box',
    description: 'The perfect Ramadan gift: includes a velvet namaz chadar, 99-bead tasbih, oud attar, a beautifully printed Dua book, and a handwritten Ramadan card. All in a rigid luxury box tied with a satin ribbon.',
    price: 5500,
    category: 'Gift Sets',
    images: [
      'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Gold Box','Rose Gold Box'],
    material: 'Mixed Premium', stock: 15,
    isFeatured: true, isNewArrival: false,
    tags: ['ramadan','gift','luxury box','tasbih','chadar','attar'],
    ratings: { average: 5.0, count: 38 },
  },
  {
    name: 'Eid Abaya + Hijab Set',
    description: 'A complete Eid outfit: a premium embroidered abaya paired with a matching chiffon hijab and underscarves. Packed together in a beautiful gift box with tissue paper.',
    price: 6200, originalPrice: 7500,
    category: 'Gift Sets',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    ],
    sizes: ['S','M','L','XL'],
    colors: ['Black Gold','Ivory Gold'],
    material: 'Korean Nida + Chiffon', stock: 20,
    isFeatured: true, isNewArrival: true,
    tags: ['eid','set','abaya','hijab','gift box'],
    ratings: { average: 4.9, count: 27 },
  },
  {
    name: 'New Bride Islamic Gift Set',
    description: 'Curated for the new bride: includes an embroidered prayer chadar, pearl tasbih, oud attar, a Quran with wooden stand, and a heartfelt dua card. The most thoughtful wedding gift.',
    price: 8500,
    category: 'Gift Sets',
    images: [
      'https://images.unsplash.com/photo-1583939411023-14783179e581?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Blush Pink Box','Ivory Box'],
    material: 'Mixed Premium', stock: 10,
    isFeatured: true, isNewArrival: false,
    tags: ['bride','wedding','nikah','gift','quran','tasbih'],
    ratings: { average: 5.0, count: 22 },
  },

  // ── KIDS ─────────────────────────────────────────────────────────────────
  {
    name: 'Mini Momina Kids Abaya',
    description: 'Adorable mini abaya for your little ones in the same premium quality as our adult line. Soft cotton-blend fabric, comfortable elastic at wrists. Available for girls ages 4–12.',
    price: 2200,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    ],
    sizes: ['4Y','6Y','8Y','10Y','12Y'],
    colors: ['Pink','Lilac','White','Black'],
    material: 'Soft Cotton Blend', stock: 35,
    isFeatured: true, isNewArrival: true,
    tags: ['kids','girls','mini abaya','cute'],
    ratings: { average: 4.8, count: 41 },
  },
  {
    name: 'Kids Prayer Set',
    description: 'Teach your little one the beauty of prayer with this adorable kids prayer set. Includes a small namaz chadar and matching prayer cap decorated with stars and moon print.',
    price: 1200,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1544627680-80f6baf6d534?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Pink Stars','Blue Moon','White'],
    material: 'Soft Cotton', stock: 50,
    isFeatured: false, isNewArrival: true,
    tags: ['kids','prayer','chadar','cap','stars','moon'],
    ratings: { average: 4.7, count: 29 },
  },
  {
    name: 'Kids Hijab Starter Kit',
    description: '5-piece hijab starter kit for young girls learning to wear hijab. Includes jersey hijabs in 5 pastel colors with matching underscarves. Soft, no-pin, and easy to wear independently.',
    price: 1800,
    category: 'Kids',
    images: [
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=600&q=80',
    ],
    sizes: ['Free Size'],
    colors: ['Pastel Set (5 colours)'],
    material: 'Cotton Jersey', stock: 30,
    isFeatured: false, isNewArrival: false,
    tags: ['kids','hijab kit','starter','pastel','no-pin'],
    ratings: { average: 4.6, count: 23 },
  },
];

// ── Seed Function ────────────────────────────────────────────────────────────
async function seed() {
  console.log('\n🌸 Gumnam Momina — Database Seeder\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB:', MONGO_URI);

  // ── Admin user ──────────────────────────────
  await User.deleteOne({ email: 'admin@gumnammomina.pk' });
  const hashed = await bcrypt.hash('admin123456', 12);
  await User.create({
    name:  'Admin',
    email: 'admin@gumnammomina.pk',
    password: hashed,
    role:  'admin',
    phone: '+92 300 0000000',
    cart:  [],
  });
  console.log('👑 Admin user created');
  console.log('   Email:    admin@gumnammomina.pk');
  console.log('   Password: admin123456');

  // ── Products ────────────────────────────────
  await Product.deleteMany({});
  console.log('🗑️  Old products cleared');

  const inserted = await Product.insertMany(products);
  console.log(`\n✨ ${inserted.length} products seeded successfully!\n`);

  // Print summary by category
  const cats = {};
  products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  Object.entries(cats).forEach(([cat, count]) => {
    console.log(`   ${cat.padEnd(16)} → ${count} products`);
  });

  console.log('\n📊 Summary:');
  console.log(`   Featured products:    ${products.filter(p => p.isFeatured).length}`);
  console.log(`   New arrivals:         ${products.filter(p => p.isNewArrival).length}`);
  console.log(`   Total stock units:    ${products.reduce((a, p) => a + p.stock, 0)}`);

  console.log('\n🚀 Ready! Run your servers:');
  console.log('   cd backend  → npm run dev');
  console.log('   cd frontend → npm run dev');
  console.log('\n   Then open: http://localhost:3000\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('\n❌ Seed failed:', err.message);
  console.error('\nMake sure MongoDB is running! Try:  mongod\n');
  process.exit(1);
});
