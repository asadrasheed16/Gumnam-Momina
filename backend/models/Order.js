const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String
  }],
  shippingAddress: {
    name: { type: String, required: true },
    phone: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: String
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Bank Transfer', 'EasyPaisa', 'JazzCash'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 200 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  notes: String,
  trackingNumber: String,
  deliveredAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
