import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
//import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  //const { approvalURL } = useSelector((state) => state.shopOrder);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleInitiatePayment = () => {
    if (!cartItems || cartItems.items.length === 0) {
      toast({
        title: "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để tiếp tục.",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Vui lòng chọn địa chỉ để tiếp tục.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
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
      if (data?.payload?.success) {
        setIsPaymentStart(true);
        if (paymentMethod === "cod") {
          toast({
            title: "Đặt hàng thành công!",
            description: "Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý sớm nhất.",
          });
          navigate("/shop/account");
        }
      } else {
        setIsPaymentStart(false);
      }
    });
  };

  // Redirect to approval URL if available and payment starts
  // if (approvalURL && !isPaymentStart) {
  //   window.location.href = approvalURL;
  // }

  return (
    <div className="container mx-auto px-4 py-8">
  <h2 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h2>

  <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
    <div className="bg-white p-6 rounded shadow-sm border space-y-6 ">
      <h3 className=" text-lg font-semibold">Sản phẩm trong giỏ hàng</h3>

      {cartItems && cartItems.items?.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {cartItems.items.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))}
        </div>
      ) : (
        <p>Giỏ hàng của bạn đang trống.</p>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng:</span>
          <span>{totalCartAmount.toLocaleString()} đ</span>
        </div>
      </div>

      <div className="pt-4">
        <h4 className="font-semibold mb-2">Phương thức thanh toán</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setPaymentMethod("paypal")}
            className={`flex-1 py-2 px-4 rounded border ${
              paymentMethod === "paypal"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            PayPal
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`flex-1 py-2 px-4 rounded border ${
              paymentMethod === "cod"
                ? "bg-green-500 text-white"
                : "bg-gray-100"
            }`}
          >
            COD
          </button>
        </div>
        <p className="text-sm mt-2 text-gray-600">
          {paymentMethod === "paypal"
            ? "Thanh toán qua PayPal"
            : "Thanh toán khi nhận hàng"}
        </p>
      </div>

      <Button
        onClick={handleInitiatePayment}
        className="w-full mt-4 bg-red-500 hover:bg-red-600"
      >
        {isPaymentStart
          ? "Đang xử lý thanh toán..."
          : `Thanh toán ${paymentMethod === "paypal" ? "PayPal" : "COD"}`}
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
