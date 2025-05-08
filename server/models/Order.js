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
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
        required: true,
      },
      title: String,
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
      "pending",      // Đơn hàng mới được tạo, chờ xác nhận
      "confirmed",    // Admin đã xác nhận đơn
      "processing",   // Đang chuẩn bị hàng
      "shipped",      // Đã giao cho đơn vị vận chuyển
      "delivered",    // Đã giao tới khách hàng
      "cancelled",    // Khách hoặc admin huỷ
      "returned"      // Khách hoàn trả
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
      "pending",    // Đã tạo đơn nhưng chưa thanh toán (MoMo chưa redirect hoặc COD chưa giao)
      "unpaid",     // Cố gắng thanh toán nhưng thất bại hoặc chưa thanh toán
      "paid",       // Thanh toán thành công (MoMo redirect hoặc đã nhận tiền)
      "failed",     // Thanh toán thất bại (MoMo báo lỗi, user huỷ, timeout)
      "refunded",   // Đã hoàn tiền
      "cancelled"   // Đơn bị huỷ (chưa thanh toán hoặc đã được hoàn)
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
