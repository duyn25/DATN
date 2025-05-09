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
import { translateOrderStatus, translatePaymentStatus } from "../../lib/utils";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, loading } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }
console.log("ỏder",orderList)
  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId(user?.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);
  
console.log("order detail",orderDetails)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử mua hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Sản phẩm</TableHead>
              <TableHead>Thời gian đặt hàng</TableHead>
              <TableHead>Trạng thái đơn hàng</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Tổng</TableHead>
              <TableHead>
                <span className="sr-only">Chi tiết</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.length > 0 ? (
              orderList.map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell className="flex flex-col gap-2">
                  {orderItem.orderItems.map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ))}
                </TableCell>
                  <TableCell>
                      {orderItem?.orderDate
                    ? new Date(orderItem?.orderDate).toLocaleString() 
                    : ''}
                  </TableCell>
                  <TableCell>
                      {translateOrderStatus(orderItem?.orderStatus)}
                  </TableCell>
                  <TableCell>{translatePaymentStatus(orderItem?.paymentStatus)}</TableCell>
                  <TableCell>{orderItem?.totalAmount.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      >
                        Xem chi tiết
                      </Button>
                      {orderDetails && <ShoppingOrderDetailsView orderDetails={orderDetails} />}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4">
                  Bạn chưa có đơn hàng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
