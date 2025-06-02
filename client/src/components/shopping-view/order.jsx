import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  cancelOrderById,
} from "@/store/shop/order-slice";
import { translateOrderStatus, translatePaymentStatus } from "@/lib/utils";
import { useToast } from "../ui/use-toast";

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "processing", label: "Đang chuẩn bị" },
  { id: "shipped", label: "Đang giao" },
  { id: "delivered", label: "Hoàn tất" },
  { id: "cancelled", label: "Đã huỷ" },
];

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user?.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedOrderId) {
      dispatch(getOrderDetails(selectedOrderId));
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
  const handleCancelOrder = async (orderId) => {
  const confirm = window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này?");
  if (!confirm) return;

  dispatch(cancelOrderById(orderId)).then((data) => {
    if (data?.payload?.success) {
      toast({
        title: "Huỷ đơn hàng thành công",
      });
      dispatch(getAllOrdersByUserId(user.id));
    } else {
      toast({
        title: "Không thể huỷ đơn hàng",
        description: data?.payload?.message || "Đã xảy ra lỗi khi huỷ.",
        variant: "destructive",
      });
    }
  });
};



  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Lịch sử mua hàng</h2>

      <div className="flex gap-2 flex-wrap">
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

      {filteredOrders?.length > 0 ? (
        filteredOrders.map((orderItem) => (
          <Card
            key={orderItem._id}
            className="p-4 shadow-md rounded-xl flex justify-between items-center hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {orderItem.orderItems.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded border"
                  />
                ))}
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Đặt lúc: {new Date(orderItem.orderDate).toLocaleString()}
                </div>
                <div className="font-medium text-base">
                  Trạng thái: {translateOrderStatus(orderItem.orderStatus)}
                </div>
                <div className="text-sm">
                  Thanh toán: {translatePaymentStatus(orderItem.paymentStatus)}
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-lg font-semibold text-primary">
                {orderItem.totalAmount.toLocaleString()} đ
              </div>
              <Button
                variant="default"
                onClick={() => setSelectedOrderId(orderItem._id)}
              >
                Xem chi tiết
              </Button>
              {["pending", "confirmed"].includes(orderItem.orderStatus) && (
            <Button
              variant="destructive"
              className="ml-2"
              onClick={() => handleCancelOrder(orderItem._id)}
            >
              Huỷ đơn
            </Button>
)}

            </div>
          </Card>
        ))
      ) : (
        <div className="text-center text-muted-foreground mt-10">
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
        {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
      </Dialog>
    </div>
  );
}

export default ShoppingOrders;
