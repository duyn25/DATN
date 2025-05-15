import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../store/admin/stat-slice';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Loader2 } from 'lucide-react';
const ORDER_STATUS_LABELS = {
  pending: "Đang xử lý",
  confirmed: "Đã xác nhận",
  shipped: "Đang giao hàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};
const weekdayLabels = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

export default function AdminStatistics() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.adminStats);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  }

  if (!data) return null;

  const { totalRevenue, totalOrders, totalProducts, monthlyRevenue, revenueByDay,topSellingProducts,orderStatusStats } = data;

  return (
    <div className="p-4 space-y-6">
      {/* Tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
            <p className="text-xl font-semibold text-green-600">{totalRevenue.toLocaleString()} đ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
            <p className="text-xl font-semibold">{totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
            <p className="text-xl font-semibold">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
        <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tình trạng đơn hàng</p>
            {orderStatusStats.map((status) => {
            const statusLabel = ORDER_STATUS_LABELS[status._id] || status._id;
            const percentage = ((status.count / totalOrders) * 100).toFixed(2); 

            return (
                <div key={status._id} className="flex justify-between items-center mb-4">
                <span className="font-semibold">{statusLabel}</span>
                <div className="flex items-center">
                    <span className="mr-2">{status.count} đơn</span>
                    <span className="text-sm text-muted-foreground">({percentage}%)</span>
                </div>
                </div>
            );
            })}
        </CardContent>
        </Card>
      </div>
  {/* Biểu đồ doanh thu theo ngày trong tuần */}
      <Card>
  <CardContent className="p-6">
    <h2 className="text-lg font-bold mb-4">Doanh thu theo ngày trong tuần</h2>
    <ResponsiveContainer width="65%" height={300}>
      <BarChart
        data={revenueByDay.map(day => ({
          name: weekdayLabels[day.dayOfWeek],
          total: day.total
        }))}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

      {/* Biểu đồ doanh thu theo tháng */}
      <Card>
  <CardContent className="p-6">
    <h2 className="text-lg font-bold mb-4">Doanh thu theo tháng</h2>
    <ResponsiveContainer width="70%" height={300}>
      <BarChart
        data={monthlyRevenue.map((m) => ({
          name: `Tháng ${m.month}`,
          total: m.total
        }))}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


      {/* Top sản phẩm bán chạy */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">Top 5 sản phẩm bán chạy</h2>
          <ul className="space-y-2">
            {topSellingProducts.map((p, i) => (
              <li key={p._id} className="flex justify-between items-center">
                <span>{i + 1}. {p.productName}</span>
                <span className="text-sm text-muted-foreground">{p.sold} đã bán</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}