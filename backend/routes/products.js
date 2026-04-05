const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/products - Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, featured, newArrival, search, sort, page = 1, limit = 12 } = req.query;

    let query = { isAvailable: true };

    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (search) query.$text = { $search: search };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { 'ratings.count': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Admin: Create product
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/products/:id - Admin: Update product
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Admin: Delete product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products/:id/review
router.post('/:id/review', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment
    });

    product.ratings.count = product.reviews.length;
    product.ratings.average = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products/seed - Seed sample products (dev only)
router.post('/seed/data', protect, adminOnly, async (req, res) => {
  try {
    await Product.deleteMany();

    const sampleProducts = [
      {
        name: 'Midnight Rose Abaya',
        description: 'Elegant black abaya with delicate rose embroidery on the cuffs and hem. Crafted from premium Korean nida fabric for all-day comfort.',
        price: 4500,
        originalPrice: 5500,
        category: 'Abaya',
        images: ['https://images.unsplash.com/photo-1585241936939-be4099591252?w=600'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy'],
        material: 'Korean Nida',
        stock: 25,
        isFeatured: true,
        isNewArrival: true,
        tags: ['luxury', 'embroidered', 'bestseller']
      },
      {
        name: 'Golden Veil Premium Hijab',
        description: 'Luxurious chiffon hijab with golden thread details. Lightweight, breathable, and perfect for special occasions.',
        price: 1200,
        originalPrice: 1500,
        category: 'Hijab',
        images: ['https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600'],
        sizes: ['Free Size'],
        colors: ['Ivory', 'Beige', 'Dusty Rose'],
        material: 'Premium Chiffon',
        stock: 50,
        isFeatured: true,
        tags: ['chiffon', 'elegant']
      },
      {
        name: 'Velvet Namaz Chadar',
        description: 'Soft velvet prayer chadar with intricate Islamic geometric patterns. Comes in a beautiful gift box.',
        price: 2800,
        category: 'Namaz Chadar',
        images: ['https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600'],
        sizes: ['Free Size'],
        colors: ['Emerald', 'Burgundy', 'Navy', 'Black'],
        material: 'Premium Velvet',
        stock: 30,
        isFeatured: true,
        tags: ['prayer', 'gift', 'velvet']
      },
      {
        name: 'Pearl Tasbih Collection',
        description: 'Handcrafted 99-bead tasbih with natural freshwater pearls and a gold clasp. A perfect gift.',
        price: 1800,
        category: 'Accessories',
        images: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600'],
        sizes: ['Free Size'],
        colors: ['White Pearl', 'Pink Pearl'],
        stock: 40,
        isFeatured: true,
        isNewArrival: true,
        tags: ['tasbih', 'gift', 'pearl']
      },
      {
        name: 'Butterfly Open Abaya',
        description: 'Flowing butterfly-style open abaya perfect for layering. Modern design meets Islamic modesty.',
        price: 3800,
        category: 'Abaya',
        images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'Brown', 'Grey'],
        material: 'Crepe',
        stock: 20,
        isNewArrival: true,
        tags: ['modern', 'butterfly', 'open abaya']
      },
      {
        name: 'Ramadan Gift Set',
        description: 'The perfect Ramadan gift: includes a prayer chadar, tasbih, attar and a beautiful Quran stand. Packaged in a luxury box.',
        price: 5500,
        category: 'Gift Sets',
        images: ['https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600'],
        sizes: ['Free Size'],
        colors: ['Gold Box'],
        stock: 15,
        isFeatured: true,
        tags: ['ramadan', 'eid', 'gift', 'set']
      },
      {
        name: 'Mini Momina Kids Abaya',
        description: 'Adorable mini abaya for your little ones. Same premium quality as adult line, sized for girls 4-12.',
        price: 2200,
        category: 'Kids',
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
        sizes: ['4Y', '6Y', '8Y', '10Y', '12Y'],
        colors: ['Pink', 'Lilac', 'White', 'Black'],
        material: 'Soft Cotton Blend',
        stock: 35,
        isNewArrival: true,
        tags: ['kids', 'girls', 'cute']
      },
      {
        name: 'Embroidered Khimar',
        description: 'A statement khimar with hand-done floral embroidery. Flowy, modest, and incredibly beautiful.',
        price: 3200,
        category: 'Hijab',
        images: ['https://images.unsplash.com/photo-1563746924237-f81d813e4a97?w=600'],
        sizes: ['Free Size'],
        colors: ['Black', 'White', 'Teal'],
        material: 'Crepe with Embroidery',
        stock: 18,
        isFeatured: true,
        tags: ['khimar', 'embroidered']
      }
    ];

    await Product.insertMany(sampleProducts);
    res.json({ message: `${sampleProducts.length} products seeded successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
