const mongoose = require("mongoose");

const specificationSchema = new mongoose.Schema({
  specName: {
    type: String,
    required: true,
    unique: true,
  },
  specDescription: String,
  specType: {
    type: String,
    enum: ['text', 'number', 'select'], 
    default: 'text',
  },
  specUnit: String, 
  allowedValues: {
    type: [String],
    default: [],
  },
});
module.exports =  mongoose.model('specificationList', specificationSchema);
