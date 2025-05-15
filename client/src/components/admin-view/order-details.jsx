import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { translateOrderStatus, translatePaymentStatus } from "../../lib/utils";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { DialogTitle } from "@radix-ui/react-dialog";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetail");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;
    console.log(formData,"order data")
    const updatedData = {
    id: orderDetails?._id,
    orderStatus: status,
    paymentStatus: status === "delivered" ? "paid" : orderDetails?.paymentStatus,
  };

    dispatch(
      updateOrderStatus(updatedData)
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-5 items-center justify-between">
            <p className="font-medium">ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">User ID</p>
            <Label>{orderDetails?.userId?._id}</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Thời gian đặt hàng</p>
            <Label>
            {orderDetails?.orderDate
              ? new Date(orderDetails?.orderDate).toLocaleString() 
              : ''}
          </Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Tổng</p>
            <Label>{orderDetails?.totalAmount.toLocaleString()} đ</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Phương thức thanh toán</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Tình trạng thanh toán</p>
            <Label>
            {orderDetails?.orderStatus === "delivered" ? "Đã thanh toán" : translatePaymentStatus(orderDetails?.paymentStatus)}</Label>
          </div>
          <div className="flex mt-1 items-center justify-between">
            <p className="font-medium">Tình trạng đơn hàng</p>
            <Label>
                {translateOrderStatus(orderDetails?.orderStatus)}
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Sản phẩm</div>
            <ul className="grid gap-3">
              {orderDetails?.orderItems && orderDetails?.orderItems.length > 0
                ? orderDetails?.orderItems.map((item) => (
                    <li className="flex items-center justify-between">
                      <span>Tên: {item.productName}</span>
                      <span>Số lượng: {item.quantity}</span>
                      <span>Giá: {item.price.toLocaleString()}</span>
                    </li>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Thông tin giao hàng</div>
            <div className="grid text-muted-foreground">
              <table className="table-auto w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 font-semibold">Tên khách hàng</td>
                    <td className="px-4 py-2">{orderDetails?.userId?.userName}</td>
                  </tr>
                  <tr>
                    <td className="px-4 font-semibold">Địa chỉ</td>
                    <td className="px-4">{orderDetails?.addressInfo?.address}</td>
                  </tr>
                  <tr>
                    <td className="px-4  font-semibold">Thành phố</td>
                    <td className="px-4 ">{orderDetails?.addressInfo?.city}</td>
                  </tr>
                  <tr>
                    <td className="px-4  font-semibold">SĐT</td>
                    <td className="px-4 ">{orderDetails?.addressInfo?.phone}</td>
                  </tr>
                  <tr>
                    <td className="px-4  font-semibold">Ghi chú</td>
                    <td className="px-4 ">{orderDetails?.addressInfo?.notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Trạng thái đơn hàng",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Chờ xác nhận" },
                  { id: "confirm", label: "Đã xác nhận" },
                  { id: "processing", label: "Đang chuẩn bị hàng" },
                  { id: "shipped", label: "Đang giao hàng" },
                  { id: "delivered", label: "Đã giao hàng" },
                  { id: "cancelled", label: "Huỷ đơn hàng" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Cập nhật đơn hàng"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;