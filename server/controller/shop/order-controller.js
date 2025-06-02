const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const axios = require("axios");
const crypto = require("crypto");

// config MoMo
const partnerCode = "MOMO";
const accessKey = "F8BBA842ECF85";
const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
const redirectUrl = "http://localhost:5173/shop/payment-success";  
const ipnUrl = "https://29ac-2402-800-61c5-6500-58ae-f5eb-510c-ffa2.ngrok-free.app/api/shop/order/momo-ipn";  
let momoOrder = {};
const updateProductQuantities = async (orderItems) => {
  for (const item of orderItems) {
    const productId = item.productId;
    const quantity = item.quantity;

    await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { totalStock: -quantity, sold: quantity },
      },
      { new: true }
    );
  }
};
const createOrder = async (req, res) => {
  try {
    const { userId, cartId, orderItems, addressInfo, totalAmount, paymentMethod } = req.body;
    console.log("body", req.body)
    const orderDate = new Date();
    const orderStatus = "pending";
    const paymentStatus = paymentMethod === "cod" ? "pending" : "unpaid";
    const orderUpdateDate = orderDate;

    if (!userId || !cartId || !orderItems?.length || !addressInfo || !totalAmount) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin đơn hàng!" });
    }

    if (paymentMethod === "cod") {
      const codOrder = new Order({
        userId,
        cartId,
        orderItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: null,
      });

      await codOrder.save();
      await updateProductQuantities(orderItems);
      console.log('cart id',cartId)
      await Cart.findByIdAndDelete(cartId);

      return res.status(201).json({
         success: true,
          message: "Đơn hàng đã được tạo (COD)", 
          orderId: codOrder._id });
    }

    if (paymentMethod === "momo") {
      const requestId = partnerCode + Date.now();
      const orderId = requestId;
      const orderInfo = "Thanh toán đơn hàng qua MoMo";
      const amount = totalAmount.toString();
      const extraData = "";
      const requestType = "captureWallet";
      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
      
      const momoRequestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: "vi",
      };
      const momoResponse = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", momoRequestBody, {
        headers: { "Content-Type": "application/json" },
      });
      if (momoResponse.data && momoResponse.data.payUrl) {
        momoOrder = {
          userId,
          cartId,
          orderItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus: "unpaid",
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId: orderId,
        };
        return res.status(201).json({ success: true, payUrl: momoResponse.data.payUrl, orderId: momoOrder._id });
      } else {
        return res.status(400).json({ success: false, message: "Không lấy được MoMo payUrl" });
      }
    }

    return res.status(400).json({ success: false, message: "Phương thức thanh toán không hợp lệ" });

  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return res.status(500).json({ 
        success: false, 
        message: "Lỗi khi tạo đơn hàng" });
  }
};
  const getAllOrdersByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const orders = await Order.find({ userId });
  
      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  const getOrderDetails = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findById(id);
      console.log("order",order)
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
      
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  const momoIpnHandler = async (req, res) => {
    try {
      const { orderId } = req.body;
  
      const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
      const accessKey = "F8BBA842ECF85";
  
      const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
  
      const requestBody = {
        partnerCode: "MOMO",
        requestId: orderId,
        orderId: orderId,
        signature: signature,
        lang: "vi",
      };
  
      const momoRes = await axios.post(
        "https://test-payment.momo.vn/v2/gateway/api/query",
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      const momoData = momoRes.data;
      console.log("Kết quả từ MoMo:", momoData);
  
      if (momoData.resultCode === 0) {
          momoOrder.paymentStatus = "paid"
          const newOrder = new Order({
            userId: momoOrder.userId,
            cartId: momoOrder.cartId,
            orderItems: momoOrder.orderItems,
            addressInfo:momoOrder.addressInfo,
            orderStatus: momoOrder.orderStatus,
            paymentMethod:momoOrder.paymentMethod,
            paymentStatus:momoOrder.paymentStatus,
            totalAmount:momoOrder.totalAmount,
            orderDate:momoOrder.orderDate,
            orderUpdateDate:momoOrder.orderUpdateDate,
            paymentId: momoOrder.paymentId,
          })
          await newOrder.save();
          await updateProductQuantities(momoOrder.orderItems);
          await Cart.findByIdAndDelete(momoOrder.cartId);
        return res.status(200).json({
          success: true,
          message: "Thanh toán thành công",
          data:momoData,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Thanh toán không thành công hoặc chưa xác nhận",
          momoData,
        });
      }
    } catch (error) {
      console.error("Lỗi xử lý IPN MoMo:", error);
      res
        .status(500)
        .json({ success: false, message: "Lỗi xử lý thông báo thanh toán" });
    }
  };
  const cancelOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Đơn hàng không thể huỷ ở trạng thái hiện tại",
      });
    }

    order.orderStatus = "cancelled";
    order.orderUpdateDate = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Đơn hàng đã được huỷ thành công",
    });
  } catch (error) {
    console.error("Lỗi huỷ đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi huỷ đơn hàng",
    });
  }
};

module.exports = {
  createOrder,
  momoIpnHandler,
  getAllOrdersByUser,
  getOrderDetails,
  cancelOrderById,
};
