import { HousePlus, LogOut, Menu, Search, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useState } from "react";
import MenuItems from "./menu";
import UserCartWrapper from "./cart-wrapper";

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const {cartItems} =useSelector(state=>state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-[#7d161c]">
            <AvatarFallback className="bg-[#7d161c] text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <span>{user?.userName}</span>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>{user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4 " /> Tài khoản
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          className="flex items-center rounded-xl bg-[#7d161c] hover:bg-gray-800 h-12 gap-1"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="w-6 h-6 " />
          <span>Giỏ hàng</span>
        </Button>
        <UserCartWrapper cartItems={cartItems && cartItems.items &&cartItems.items.length >0 ? cartItems.items :[] }/>
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-40 w-full h-[80px] border-b  bg-[#d9503f] text-white ">
        <div className="flex items-center justify-center px-4 py-3 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-3">
            <HousePlus className="h-6 w-6" />
            <span className="font-bold mr-10">HC Store</span>
          </Link>

          {/* Nút danh mục + menu dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button
              className={`flex items-center rounded-xl gap-1 h-12 transition-all duration-200 ${
                isHovered
                  ? "!bg-gray-800  !text-white"
                  : "bg-[#7d161c] text-white hover:bg-gray-800"
              }`}
            >
              <Menu size={25} />
              <Link to="/shop/product">Danh mục</Link>
            </Button>

            {isHovered && (
              <div className="absolute left-0 z-50 flex bg-white text-black shadow-xl w-[250px] rounded-br-xl transition-all duration-200">
                <MenuItems />
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
              <Button className="h-12 rounded-x1 gap-1 bg-[#7d161c]">
                <Search className="text-gray-500 " size={18} />
                <Link to="/shop/search">Tìm kiếm</Link>
              </Button>
             
          </div>

          {/* Giỏ hàng & tài khoản */}
          <HeaderRightContent />
        </div>
      </header>
    </div>
  );
}

export default ShoppingHeader;
