const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const dotenv    = require('dotenv');
const path      = require('path');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-vercel-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/users',    require('./routes/users'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'Gumnam Momina API running ✨' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🌙 Gumnam Momina Server running on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
