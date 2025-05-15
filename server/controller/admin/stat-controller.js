const Order = require("../../models/Order");
const Product = require("../../models/Product");

const ORDER_STATUS_LABELS = {
  pending: "Đang xử lý",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy"
};

const getAdminStatistics = async (req, res) => {
  try {
    const { year } = req.query;  // Lấy tham số `year` từ query params, mặc định là năm hiện tại
    const currentYear = year || new Date().getFullYear();
    // Tổng doanh thu
    const totalRevenueAgg = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Tổng đơn hàng và tổng sản phẩm
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Top sản phẩm bán chạy
    const topSellingProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("productName sold");

    // Doanh thu theo tháng
    

    // === Doanh thu theo các tháng trong năm ===
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $addFields: {
          orderDateObj: {
            $convert: {
              input: "$orderDate",
              to: "date",
              onError: null,
              onNull: null
            }
          }
        }
      },
      { $match: { orderDateObj: { $ne: null } } },
      {
        $match: {
          "orderDateObj": {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${parseInt(currentYear) + 1}-01-01`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$orderDateObj" }, year: { $year: "$orderDateObj" } },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    // Tạo mảng đủ 12 tháng
    const completeMonthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i + 1;
      const found = monthlyRevenue.find((m) => m._id.month === monthIndex || m._id === monthIndex);
      return {
        month: monthIndex,
        total: found ? found.total : 0
      };
    });

    const today = new Date();
    const localWeekDay = today.getDay() === 0 ? 7 : today.getDay(); 

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - localWeekDay + 1);
    startOfWeek.setHours(0, 0, 0, 0); 

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

console.log("Start of week:", startOfWeek.toLocaleString());
console.log("End of week:", endOfWeek.toLocaleString());

     const revenueByDay = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          orderDate: {
            $gte: startOfWeek,
            $lte: endOfWeek
          }
        }
      },
      {
        $addFields: {
          orderDateObj: { $toDate: "$orderDate" },
          isoDay: { $isoDayOfWeek: { $toDate: "$orderDate" } } 
        }
      },
      {
        $group: {
          _id: "$isoDay",
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const allDays = [1, 2, 3, 4, 5, 6, 7]; 
    const completeRevenueByDay = allDays.map((day) => {
      const dayRevenue = revenueByDay.find((item) => item._id === day);
      return {
        dayOfWeek: day,
        total: dayRevenue ? dayRevenue.total : 0
      };
    });
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const mappedOrderStatusStats = orderStatusStats.map((status) => ({
      ...status,
      _id: ORDER_STATUS_LABELS[status._id] || status._id
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      topSellingProducts,
      monthlyRevenue:completeMonthlyRevenue,
      revenueByDay: completeRevenueByDay,  
      orderStatusStats: mappedOrderStatusStats
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thống kê", error });
  }
};

module.exports = {
  getAdminStatistics,
};
