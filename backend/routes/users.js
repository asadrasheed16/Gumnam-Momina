const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/users  — Admin: list all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    let query = {};
    if (role)   query.role = role;
    if (search) query.$or = [
      { name:  { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page)-1) * Number(limit))
      .limit(Number(limit));
    res.json({ users, total, page: Number(page), pages: Math.ceil(total/Number(limit)) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/:id  — Admin: single user + order history
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('wishlist','name images price');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(10);
    res.json({ user, orders });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/users/:id  — Admin: update role / isActive
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const update = {};
    if (role     !== undefined) update.role     = role;
    if (isActive !== undefined) update.isActive = isActive;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/users/:id  — Admin: delete user
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/users/profile — Logged-in user updates own profile
router.put('/me/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
