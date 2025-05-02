const mongoose = require("mongoose");

const categorySpecSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  specId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specification',
    required: true,
  },
});

module.exports = mongoose.model('CategorySpec', categorySpecSchema);
