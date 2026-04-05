const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  addresses: [{
    label: String, street: String, city: String, province: String, postalCode: String,
    isDefault: { type: Boolean, default: false }
  }],
  cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1 },
    size: String, color: String
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
