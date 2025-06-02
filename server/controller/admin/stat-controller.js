const Order = require("../../models/Order");
const Product = require("../../models/Product");

const ORDER_STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipped: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const getAdminStatistics = async (req, res) => {
  try {
    const { year, month, quarter } = req.query;
    const currentYear = parseInt(year, 10) || new Date().getFullYear();

    let startDate = new Date(`${currentYear}-01-01`);
    let endDate = new Date(`${currentYear + 1}-01-01`);

    if (month) {
      const monthInt = parseInt(month, 10);
      startDate = new Date(currentYear, monthInt - 1, 1);
      endDate = new Date(currentYear, monthInt, 1);
    } else if (quarter) {
      const quarterInt = parseInt(quarter, 10);
      startDate = new Date(currentYear, (quarterInt - 1) * 3, 1);
      endDate = new Date(currentYear, quarterInt * 3, 1);
    }

    const dateFilter = {
      orderStatus: "delivered",
      orderDate: { $gte: startDate, $lt: endDate },
    };

    const [{ totalRevenue = 0 } = {}] = await Order.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const [totalOrders, totalProducts] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
    ]);

    const topSellingProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("productName sold");
    const slowSellingProducts = await Product.find()
    .sort({ sold: 1 })
    .limit(5)
    .select("productName sold");

    const monthlyRevenue = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { month: { $month: "$orderDate" }, year: { $year: "$orderDate" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const completeMonthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const monthIndex = i + 1;
      const found = monthlyRevenue.find((m) => m._id.month === monthIndex);
      return {
        month: monthIndex,
        total: found ? found.total : 0,
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

    const revenueByDay = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          orderDate: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { dayOfWeek: { $isoDayOfWeek: "$orderDate" } },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.dayOfWeek": 1 } },
    ]);

    const completeRevenueByDay = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = i + 1;
      const found = revenueByDay.find((d) => d._id.dayOfWeek === dayIndex);
      return {
        dayOfWeek: dayIndex,
        total: found ? found.total : 0,
      };
    });

    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const mappedOrderStatusStats = orderStatusStats.map((status) => ({
      status: ORDER_STATUS_LABELS[status._id] || status._id,
      count: status.count,
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      topSellingProducts,
       slowSellingProducts,
      monthlyRevenue: completeMonthlyRevenue,
      revenueByDay: completeRevenueByDay,
      orderStatusStats: mappedOrderStatusStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thống kê", error });
  }
};

module.exports = { getAdminStatistics };
