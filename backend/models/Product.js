const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  description: { type: String, required: [true, 'Description is required'] },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  originalPrice: { type: Number, min: 0 },
  category: { type: String, required: [true, 'Category is required'], enum: ['Abaya','Hijab','Namaz Chadar','Accessories','Gift Sets','Kids'] },
  images: [{ type: String, required: true }],
  sizes: [{ type: String, enum: ['XS','S','M','L','XL','XXL','Free Size','4Y','6Y','8Y','10Y','12Y'] }],
  colors: [String],
  material: String,
  stock: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  tags: [String],
  // SEO & Meta
  metaTitle: { type: String, trim: true, maxlength: 70 },
  metaDescription: { type: String, trim: true, maxlength: 160 },
  metaKeywords: [String],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text', metaKeywords: 'text' });

module.exports = mongoose.model('Product', productSchema);
