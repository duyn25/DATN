const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  image: String,
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  brand: String,
  price: {
    type: Number,
    required: true,
  },
  salePrice: Number,
  totalStock: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  averageReview: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
