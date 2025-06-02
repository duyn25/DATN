import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../store/admin/stat-slice";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const weekdayLabels = {
  1: "Thứ 2", 2: "Thứ 3", 3: "Thứ 4",
  4: "Thứ 5", 5: "Thứ 6", 6: "Thứ 7", 7: "Chủ nhật",
};

export default function AdminStatistics() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.adminStats);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    dispatch(fetchAdminStats({ year: selectedYear }));
  }, [dispatch, selectedYear]);

  const handleYearChange = (e) => setSelectedYear(e.target.value);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">Lỗi: {error}</div>;
  if (!data) return null;

  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    monthlyRevenue,
    revenueByDay,
    topSellingProducts = [],
    slowSellingProducts = [],
    orderStatusStats = [],
  } = data;

  // Xuất Excel
  const exportToExcel = () => {
    const sheetData = [
      ["I. Thống kê tổng quan", ""],
      ["Tổng doanh thu", `${totalRevenue.toLocaleString()} đ`],
      ["Tổng đơn hàng", totalOrders],
      ["Tổng sản phẩm", totalProducts],
      ["", ""],
      ["II. Trạng thái đơn hàng", ""],
      ...orderStatusStats.map((s) => [s.status || s._id, s.count]),
      ["", ""],
      ["III. Doanh thu theo tháng", ""],
      ...monthlyRevenue.map((m) => [`Tháng ${m.month}`, `${m.total.toLocaleString()} đ`]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), `thong_ke_${selectedYear}.xlsx`);
  };

  // Xuất PDF
  const exportToPDF = () => {
    const docDefinition = {
      content: [
        { text: `BÁO CÁO THỐNG KÊ NĂM ${selectedYear}`, style: "header" },
        { text: "I. Thống kê tổng quan", style: "section" },
        {
          table: {
            widths: ["*", "*"],
            body: [
              ["Chỉ số", "Giá trị"],
              ["Tổng doanh thu", `${totalRevenue?.toLocaleString() || 0} đ`],
              ["Tổng đơn hàng", totalOrders ?? 0],
              ["Tổng sản phẩm", totalProducts ?? 0],
            ],
          },
        },
        orderStatusStats.length > 0 && { text: "\nII. Trạng thái đơn hàng", style: "section" },
        orderStatusStats.length > 0 && {
          table: {
            widths: ["*", "*"],
            body: [
              ["Trạng thái", "Số lượng"],
              ...orderStatusStats.map((s) => [s.status || s._id, s.count]),
            ],
          },
        },
        monthlyRevenue.length > 0 && { text: "\nIII. Doanh thu theo tháng", style: "section" },
        monthlyRevenue.length > 0 && {
          table: {
            widths: ["*", "*"],
            body: [
              ["Tháng", "Doanh thu"],
              ...monthlyRevenue.map((m) => [`Tháng ${m.month}`, `${m.total.toLocaleString()} đ`]),
            ],
          },
        },
      ].filter(Boolean),
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 12] },
        section: { fontSize: 14, bold: true, margin: [0, 12, 0, 6] },
      },
    };

    pdfMake.createPdf(docDefinition).download(`thong_ke_${selectedYear}.pdf`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Bộ lọc và xuất */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <label className="font-medium">Chọn năm:</label>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="border p-2 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>

        <button onClick={exportToExcel} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Xuất Excel
        </button>
        <button onClick={exportToPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Xuất PDF
        </button>
      </div>

      {/* Tổng quan và biểu đồ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm">Tổng doanh thu</p><p className="text-xl font-semibold text-green-600">{totalRevenue.toLocaleString()} đ</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Tổng sản phẩm</p><p className="text-xl font-semibold">{totalProducts}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm">Tổng đơn hàng</p><p className="text-xl font-semibold">{totalOrders}</p></CardContent></Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm mb-2">Trạng thái đơn hàng</p>
            <ul className="space-y-1">
              {orderStatusStats.map((s, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{s.status || s._id}</span>
                  <span className="text-sm text-muted-foreground">{s.count} đơn</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      
      {/* Doanh thu theo tháng */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">Doanh thu theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyRevenue.map((m) => ({
                name: `Tháng ${m.month}`,
                total: m.total,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
              <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
{/* Doanh thu theo ngày */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">Doanh thu theo ngày trong tuần</h2>
          {revenueByDay?.some((d) => d.total > 0) ? (
            <ResponsiveContainer width="80%" height={300}>
              <BarChart
                data={revenueByDay.map((day) => ({
                  name: weekdayLabels[day.dayOfWeek],
                  total: day.total,
                }))}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground">Không có dữ liệu tuần này.</p>
          )}
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
      <Card>
  <CardContent className="p-6">
    <h2 className="text-lg font-bold mb-4">Top 5 sản phẩm bán chậm</h2>
    <ul className="space-y-2">
      {slowSellingProducts.map((p, i) => (
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
