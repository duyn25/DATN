const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    phone: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);