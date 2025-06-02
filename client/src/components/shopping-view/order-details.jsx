import { useSelector } from "react-redux";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { DialogTitle } from "@radix-ui/react-dialog";
import { translateOrderStatus, translatePaymentStatus } from "../../lib/utils";


function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Thời gian đặt hàng</p>
            <Label>{new Date(orderDetails?.orderDate).toLocaleDateString()}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Tổng</p>
            <Label>{orderDetails?.totalAmount.toLocaleString()} đ</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Phương thức thanh toán</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Tình trạng thanh toán</p>
            <Label>{translatePaymentStatus(orderDetails?.paymentStatus)}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Tình trạng đơn hàng</p>
            <Label>
                {translateOrderStatus( orderDetails?.orderStatus)}
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Chi tiết đơn hàng</div>
            <ul className="grid gap-3">
              {orderDetails?.orderItems && orderDetails?.orderItems.length > 0
                ? orderDetails?.orderItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Tên: {item.productName}</span>
                      <span>Số lượng: {item.quantity}</span>
                      <span>Giá: {item.price.toLocaleString()} đ</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Thông tin giao hàng</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <table className="table-auto w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Tên khách hàng</td>
                    <td className="px-4 py-2">{user.userName}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Địa chỉ</td>
                    <td className="px-4 py-2">{orderDetails?.addressInfo?.address}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Thành phố</td>
                    <td className="px-4 py-2">{orderDetails?.addressInfo?.city}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">SĐT</td>
                    <td className="px-4 py-2">{orderDetails?.addressInfo?.phone}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Ghi chú</td>
                    <td className="px-4 py-2">{orderDetails?.addressInfo?.notes}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;