const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/wishlist/:productId  — toggle (add or remove)
router.post('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const pid = req.params.productId;
    const idx = user.wishlist.indexOf(pid);
    let action;
    if (idx >= 0) { user.wishlist.splice(idx, 1); action = 'removed'; }
    else          { user.wishlist.push(pid);        action = 'added';   }
    await user.save();
    await user.populate('wishlist');
    res.json({ action, wishlist: user.wishlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/wishlist/:productId — explicit remove
router.delete('/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    await user.populate('wishlist');
    res.json({ wishlist: user.wishlist });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
