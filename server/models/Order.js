const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart", 
    required: true,
  },
  orderItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true,
      },
      productName: String,
      image: String,
      price: Number,
      quantity: Number,
    },
  ],
  addressInfo: {
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address", 
      required: true,
    },
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: [
      "pending",      
      "confirmed",    
      "processing",   
      "shipped",     
      "delivered",    
      "cancelled",   
    ],
    default: "pending"
  },
  
  paymentMethod: {
    type: String,
    enum: ["momo", "cod"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: [
      "pending",    
      "unpaid",    
      "paid",       
      "failed",     
      "refunded",   
      "cancelled"   
    ],
    default: "pending"
  }
  ,
  totalAmount: Number,
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now,
  },
  paymentId: { 
    type: String, 
    required: false, 
  },
});

module.exports = mongoose.model("Order", OrderSchema);
