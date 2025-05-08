import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const renderOrderStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white"; // Green
      case "rejected":
        return "bg-red-600 text-white"; // Red
      default:
        return "bg-black text-white"; // Black
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px] mx-auto mt-[] p-6">
      <DialogTitle>
        <VisuallyHidden>Chi tiết đơn hàng</VisuallyHidden>
      </DialogTitle>

      <div className="space-y-6">
        <div className="space-y-2">
          {/* Order ID */}
          <div className="flex justify-between mt-6">
            <p className="font-medium">ID</p>
            <Label className="font-medium text-gray-700">{orderDetails?._id || "N/A"}</Label>
          </div>

          {/* Order Date */}
          <div className="flex justify-between mt-2">
            <p className="font-medium">Ngày đặt hàng</p>
            <Label className="font-medium text-gray-700">
              {orderDetails?.orderDate ? orderDetails.orderDate.split("T")[0] : "N/A"}
            </Label>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between mt-2">
            <p className="font-medium">Tổng</p>
            <Label className="font-medium text-gray-700">
              {orderDetails?.totalAmount ? orderDetails.totalAmount.toLocaleString() : "N/A"} đ
            </Label>
          </div>

          {/* Payment Method */}
          <div className="flex justify-between mt-2">
            <p className="font-medium">Phương thức thanh toán</p>
            <Label className="font-medium text-gray-700">{orderDetails?.paymentMethod || "N/A"}</Label>
          </div>

          {/* Payment Status */}
          <div className="flex justify-between mt-2">
            <p className="font-medium">Tình trạng thanh toán</p>
            <Label className="font-medium text-gray-700">{orderDetails?.paymentStatus || "N/A"}</Label>
          </div>

          {/* Order Status */}
          <div className="flex justify-between mt-2">
            <p className="font-medium">Tình trạng đơn hàng</p>
            <Label>
              <Badge className={`py-1 px-3 rounded-lg font-semibold ${renderOrderStatusBadge(orderDetails?.orderStatus)}`}>
                {orderDetails?.orderStatus || "N/A"}
              </Badge>
            </Label>
          </div>
        </div>

        <Separator className="my-4 border-t border-gray-300" />

        <div className="space-y-4">
          <div className="font-medium">Chi tiết đơn hàng</div>
          <ul className="space-y-3">
            {orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item) => (
                <li key={item._id} className="flex justify-between text-sm text-gray-700">
                  <span>Tên: {item.title}</span>
                  <span>Số lượng: {item.quantity}</span>
                  <span>Giá: {item.price.toLocaleString()} đ</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">Không có sản phẩm nào</li>
            )}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="font-medium">Thông tin giao hàng</div>
          <div className="space-y-1 text-gray-500">
            <span>Tên khách hàng: {user?.userName || "N/A"}</span>
            <span>Địa chỉ: {orderDetails?.addressInfo?.address || "N/A"}</span>
            <span>Thành phố: {orderDetails?.addressInfo?.city || "N/A"}</span>
            <span>SĐT: {orderDetails?.addressInfo?.phone || "N/A"}</span>
            <span>Ghi chú: {orderDetails?.addressInfo?.notes || "N/A"}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
