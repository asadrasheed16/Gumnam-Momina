const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// GET /api/cart - Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/cart - Add item to cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.isAvailable || product.stock < quantity) {
      return res.status(400).json({ message: 'Product is out of stock' });
    }

    const user = await User.findById(req.user._id);

    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === productId && item.size === size && item.color === color
    );

    if (existingIndex >= 0) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, size, color });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ message: 'Added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/cart/:itemId - Update cart item quantity
router.put('/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    if (quantity <= 0) {
      user.cart.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate('cart.product');

    res.json({ message: 'Cart updated', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart.pull(req.params.itemId);
    await user.save();
    await user.populate('cart.product');

    res.json({ message: 'Item removed', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/cart - Clear entire cart
router.delete('/', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
