import {
  HousePlus,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
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
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-[#7d161c] cursor-pointer">
            <AvatarFallback className="bg-[#7d161c] text-white font-bold">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>{user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" /> Tài khoản
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          size="sm"
          className="flex items-center bg-[#7d161c] text-white hover:bg-gray-800 gap-2"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Giỏ hàng</span>
        </Button>
        <UserCartWrapper
          cartItems={
            cartItems?.items?.length > 0 ? cartItems.items : []
          }
        />
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#d9503f] text-white border-b">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlus className="w-6 h-6" />
          <span className="font-bold text-lg">HC Store</span>
        </Link>

        <div
          className="relative hidden md:block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            className={`flex items-center gap-2 rounded-t-xl px-4 py-2 text-white transition-all duration-200 ${
              isHovered ? "bg-gray-800" : "bg-[#7d161c] hover:bg-gray-800"
            }`}
          >
            <Menu size={20} />
            <span>Danh mục</span>
          </Button>

          {isHovered && (
            <div className="absolute left-0 top-full w-[250px] bg-white text-black shadow-lg rounded-b-xl z-50">
              <MenuItems />
            </div>
          )}
        </div>


        <div className="flex-1 flex justify-center md:justify-start">
          <Button
            size="sm"
            className="bg-[#7d161c] hover:bg-gray-800 gap-2 text-white"
          >
            <Search size={18} />
            <Link to="/shop/search">Tìm kiếm</Link>
          </Button>
        </div>

        {/* Phần giỏ hàng & tài khoản */}
        <HeaderRightContent />
      </div>
    </header>
  );
}

export default ShoppingHeader;
