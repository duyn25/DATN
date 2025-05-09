import Address from "@/components/shopping-view/address";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Truck, Wallet } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createNewOrder } from "@/store/shop/order-slice";
import { useState } from "react";
import axios from "axios";

function ShoppingCheckout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const totalCartAmount = cartItems?.items?.reduce((sum, item) => {
    const price = item.salePrice > 0 ? item.salePrice : item.price;
    return sum + price * item.quantity;
  }, 0) || 0;

  const handleInitiatePayment = async () => {
    if (!cartItems?.items?.length) {
      return toast({
        title: "Giỏ hàng của bạn đang trống.",
        variant: "destructive",
      });
    }

    if (!currentSelectedAddress) {
      return toast({
        title: "Vui lòng chọn địa chỉ giao hàng.",
        variant: "destructive",
      });
    }

    if (!paymentMethod) {
      return toast({
        title: "Vui lòng chọn phương thức thanh toán.",
        variant: "destructive",
      });
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems._id,
      orderItems: cartItems.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress._id,
        address: currentSelectedAddress.address,
        city: currentSelectedAddress.city,
        phone: currentSelectedAddress.phone,
        notes: currentSelectedAddress.notes,
      },
      orderStatus: "pending",
      paymentMethod,
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    
    dispatch(createNewOrder(orderData)).then((data) => {
      const response = data?.payload;
    
      if (response?.success) {
        setIsPaymentStart(true);
    
        if (paymentMethod === "cod") {
          toast({
            title: "Đặt hàng thành công!",
            description: "Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý sớm nhất.",
          });
          navigate("/shop/account");
        }
    
        if (paymentMethod === "momo" && response.payUrl) {
          window.location.href = response.payUrl;
        }
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Lỗi đặt hàng",
          description: response?.message || "Đã xảy ra lỗi khi đặt hàng, vui lòng thử lại.",
          variant: "destructive",
        });
      }
    });
    
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded shadow-sm border space-y-6">
          <h3 className="text-lg font-semibold">Sản phẩm trong giỏ hàng</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {cartItems?.items?.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold">
              <span>Tổng cộng:</span>
              <span>{totalCartAmount.toLocaleString()} đ</span>
            </div>
          </div>

          <div className="pt-4">
            <h4 className="font-semibold mb-2">Phương thức thanh toán</h4>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === "momo"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-pink-500" />
                  <p className="font-medium">Thanh toán qua MoMo</p>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-500" />
                  <p className="font-medium">Thanh toán khi nhận hàng</p>
                </div>
              </label>
            </div>
          </div>

          <Button
            onClick={handleInitiatePayment}
            className="w-full mt-4 bg-red-500 hover:bg-red-600"
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Chọn địa chỉ giao hàng</h3>
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
