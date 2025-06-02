import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { translateOrderStatus, translatePaymentStatus } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "processing", label: "Đang chuẩn bị" },
  { id: "shipped", label: "Đang giao" },
  { id: "delivered", label: "Hoàn tất" },
  { id: "cancelled", label: "Đã huỷ" },
];

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrderId) {
      dispatch(getOrderDetailsForAdmin(selectedOrderId));
      setOpenDetailsDialog(true);
    }
  }, [selectedOrderId, dispatch]);

  const filteredOrders = activeTab === "all"
    ? orderList
    : orderList.filter((o) => o.orderStatus === activeTab);

  const getOrderCount = (status) => {
    if (status === "all") return orderList?.length || 0;
    return orderList?.filter((o) => o.orderStatus === status)?.length || 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tất cả đơn hàng</CardTitle>
        <div className="flex gap-2 flex-wrap mt-4">
          {TABS.map((tab) => (
            <Button
              key={tab.id}
              variant={tab.id === activeTab ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className="text-sm relative"
            >
              {tab.label}
              <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                {getOrderCount(tab.id)}
              </span>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filteredOrders && filteredOrders.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Thời gian đặt hàng</TableHead>
                  <TableHead>Trạng thái đơn hàng</TableHead>
                  <TableHead>Trạng thái thanh toán</TableHead>
                  <TableHead>Tổng</TableHead>
                  <TableHead>
                    <span className="sr-only">Details</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((orderItem) => (
                  <TableRow key={orderItem._id}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>
                      {orderItem?.orderDate
                        ? new Date(orderItem?.orderDate).toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell>
                      {translateOrderStatus(orderItem?.orderStatus)}
                    </TableCell>
                    <TableCell>
                      {translatePaymentStatus(orderItem?.paymentStatus)}
                    </TableCell>
                    <TableCell>
                      {orderItem?.totalAmount.toLocaleString()} đ
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedOrderId(orderItem._id)}
                      >
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="text-center text-muted-foreground mt-6">
            Không có đơn hàng phù hợp.
          </div>
        )}

        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            setOpenDetailsDialog(open);
            if (!open) {
              dispatch(resetOrderDetails());
              setSelectedOrderId(null);
            }
          }}
        >
          {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} />}
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
