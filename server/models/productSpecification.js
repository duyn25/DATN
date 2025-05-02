const mongoose = require("mongoose");

const productSpecificationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  specId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specification',
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('ProductSpecification', productSpecificationSchema);
