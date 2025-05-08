import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId"); 
  console.log("orderid",orderId)
  const [status, setStatus] = useState("checking"); 

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        if (!orderId) {
          setStatus("failed");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/shop/order/momo-ipn", {
          orderId,
        });

        console.log("Kết quả từ MoMo:", res.data?.data?.resultCode);

        if (res.data?.data?.resultCode === 0) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API MoMo:", err.response?.data || err.message);
        setStatus("failed");
      }
    };

    fetchOrderStatus();
  }, [orderId]);
console.log("status",status)
  return (
    <Card className="p-10 items-center text-center">
      <CardHeader className="p-0 mb-4">
        {status === "checking" && (
          <CardTitle className="text-2xl text-gray-600">
            Đang kiểm tra trạng thái thanh toán...
          </CardTitle>
        )}
        {status === "success" && (
          <CardTitle className="text-4xl text-green-600">
            Thanh toán thành công!
          </CardTitle>
        )}
        {status === "failed" && (
          <CardTitle className="text-4xl text-red-600">
            Thanh toán thất bại hoặc chưa xác nhận!
          </CardTitle>
        )}
      </CardHeader>

      {status !== "checking" && (
        <Button onClick={() => navigate("/shop/account")}>
          Xem đơn hàng
        </Button>
      )}
    </Card>
  );
}

export default PaymentSuccessPage;
