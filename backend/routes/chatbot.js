const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// ── GET /api/chatbot/context — Product catalog summary for AI context ────────
router.get('/context', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
      .select('name category price originalPrice material colors sizes stock isFeatured isNewArrival tags ratings images')
      .sort({ createdAt: -1 })
      .limit(100);

    const categories = await Product.distinct('category', { isAvailable: true });

    const summary = {
      totalProducts: products.length,
      categories,
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        material: p.material,
        colors: p.colors,
        sizes: p.sizes,
        inStock: p.stock > 0,
        stock: p.stock,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        tags: p.tags,
        rating: p.ratings?.average || 0,
        reviewCount: p.ratings?.count || 0,
        image: p.images?.[0] || '',
      })),
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/chatbot/search — AI-powered product search ─────────────────────
router.post('/search', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, featured, newArrival, search, limit = 6 } = req.body;

    let query = { isAvailable: true };
    if (category) query.category = category;
    if (featured) query.isFeatured = true;
    if (newArrival) query.isNewArrival = true;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { 'ratings.count': -1 };
    if (sort === 'rating') sortOption = { 'ratings.average': -1 };

    const products = await Product.find(query)
      .select('name category price originalPrice material colors sizes stock isFeatured isNewArrival tags ratings images')
      .sort(sortOption)
      .limit(Number(limit));

    res.json({
      count: products.length,
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        material: p.material,
        colors: p.colors,
        sizes: p.sizes,
        inStock: p.stock > 0,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        tags: p.tags,
        rating: p.ratings?.average || 0,
        image: p.images?.[0] || '',
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/chatbot/product/:id — Full product details ──────────────────────
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      material: product.material,
      colors: product.colors,
      sizes: product.sizes,
      stock: product.stock,
      inStock: product.stock > 0,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      tags: product.tags,
      rating: product.ratings?.average || 0,
      reviewCount: product.ratings?.count || 0,
      image: product.images?.[0] || '',
      images: product.images,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/chatbot/track-order — Track order (requires auth) ──────────────
router.post('/track-order', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    let order;
    if (orderId) {
      order = await Order.findOne({ _id: orderId, user: req.user._id })
        .populate('items.product', 'name images price');
    } else {
      // Get most recent order
      order = await Order.findOne({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name images price');
    }

    if (!order) return res.json({ found: false, message: 'No order found' });

    const statusSteps = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = statusSteps.indexOf(order.orderStatus);

    res.json({
      found: true,
      order: {
        _id: order._id,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        total: order.total,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
        items: order.items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image || item.product?.images?.[0] || '',
        })),
        shippingAddress: order.shippingAddress,
        timeline: statusSteps.map((step, i) => ({
          step,
          completed: i <= currentIdx,
          current: i === currentIdx,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── POST /api/chatbot/cart — Cart operations (requires auth) ─────────────────
router.post('/cart', protect, async (req, res) => {
  try {
    const { action, productId, quantity = 1, size, color, itemId } = req.body;

    const user = await User.findById(req.user._id).populate('cart.product');

    if (action === 'view') {
      return res.json({
        items: user.cart.map(item => ({
          _id: item._id,
          name: item.product?.name || 'Unknown',
          price: item.product?.price || 0,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product?.images?.[0] || '',
        })),
        count: user.cart.reduce((acc, i) => acc + i.quantity, 0),
        total: user.cart.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0),
      });
    }

    if (action === 'add') {
      const product = await Product.findById(productId);
      if (!product) return res.json({ success: false, message: 'Product not found' });
      if (!product.isAvailable || product.stock < quantity) {
        return res.json({ success: false, message: 'Product is out of stock' });
      }

      const existingIdx = user.cart.findIndex(
        item => item.product._id.toString() === productId && item.size === size && item.color === color
      );

      if (existingIdx >= 0) {
        user.cart[existingIdx].quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity, size, color });
      }

      await user.save();
      await user.populate('cart.product');

      return res.json({
        success: true,
        message: `Added ${product.name} to cart!`,
        cartCount: user.cart.reduce((acc, i) => acc + i.quantity, 0),
      });
    }

    if (action === 'remove') {
      if (itemId) {
        user.cart.pull(itemId);
      } else if (productId) {
        const idx = user.cart.findIndex(i => i.product._id.toString() === productId);
        if (idx >= 0) user.cart.splice(idx, 1);
      }
      await user.save();
      return res.json({ success: true, message: 'Item removed from cart' });
    }

    if (action === 'clear') {
      user.cart = [];
      await user.save();
      return res.json({ success: true, message: 'Cart cleared' });
    }

    return res.json({ success: false, message: 'Unknown action' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── GET /api/chatbot/recommendations — Smart recommendations ─────────────────
router.post('/recommendations', async (req, res) => {
  try {
    const { category, occasion, budget, exclude = [] } = req.body;

    let query = { isAvailable: true, _id: { $nin: exclude } };
    if (category) query.category = category;
    if (budget) {
      const maxPrice = parseInt(budget.replace(/[^0-9]/g, '')) || 50000;
      query.price = { $lte: maxPrice };
    }

    // Get featured or popular products first
    let products = await Product.find({ ...query, isFeatured: true })
      .select('name category price originalPrice material colors sizes stock tags ratings images')
      .limit(4);

    // If not enough featured, fill with popular
    if (products.length < 4) {
      const moreProducts = await Product.find({ ...query, _id: { $nin: [...exclude, ...products.map(p => p._id)] } })
        .select('name category price originalPrice material colors sizes stock tags ratings images')
        .sort({ 'ratings.count': -1, createdAt: -1 })
        .limit(4 - products.length);
      products = [...products, ...moreProducts];
    }

    res.json({
      count: products.length,
      products: products.map(p => ({
        _id: p._id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        material: p.material,
        colors: p.colors,
        image: p.images?.[0] || '',
        rating: p.ratings?.average || 0,
        tags: p.tags,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
