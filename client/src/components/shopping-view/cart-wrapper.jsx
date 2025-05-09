import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { fetchCartItems } from "@/store/shop/cart-slice";

import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useDispatch, useSelector } from "react-redux";
function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch =useDispatch();
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user]);
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
    return (
    
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Giỏ hàng của bạn</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />)
            : null}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between">
            <span className="font-bold">Tổng tiền: </span>
            <span className="font-bold">{totalCartAmount.toLocaleString()} đ</span>
          </div>
        </div>
        <Button
          onClick={() => {
            navigate("/shop/checkout");
          }}
          className="w-full mt-6 bg-red-500 hover:bg-red-700"
        >
          Xác nhận đơn
        </Button>
      </SheetContent>
    );
  }
 


export default UserCartWrapper;