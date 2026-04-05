const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/orders - Place an order
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, notes } = req.body;

    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const items = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    }));

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 5000 ? 0 : 200;
    const total = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      subtotal,
      shippingFee,
      total,
      notes
    });

    // Clear user cart after order
    user.cart = [];
    await user.save();

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/my - Get logged-in user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders - Admin: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (status) query.orderStatus = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'name email');

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/status - Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (trackingNumber) update.trackingNumber = trackingNumber;
    if (orderStatus === 'Delivered') update.deliveredAt = new Date();

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin stats
router.get('/admin/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Placed' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      deliveredOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
