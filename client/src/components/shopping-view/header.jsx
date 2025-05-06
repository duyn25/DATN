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

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          className="flex items-center bg-[#4390e3] hover:bg-white hover:text-black gap-1"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="w-6 h-6 " />
          <span>Giỏ hàng</span>
        </Button>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <span>{user?.userName}</span>
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
    </div>
  );
}

function ShoppingHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-40 w-full border-b bg-[#4390e3] text-white">
        <div className="flex h-16 items-center justify-center px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-3">
            <HousePlus className="h-6 w-6" />
            <span className="font-bold mr-3">HC Store</span>
          </Link>

          {/* Nút danh mục + menu dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button
              className={`flex items-center rounded-t-xl rounded-b-none gap-1 h-15 transition-all duration-200 ${
                isHovered
                  ? "!bg-white  !text-black"
                  : "bg-[#4390e3] text-white hover:bg-white hover:text-black"
              }`}
            >
              <Menu size={20} />
              <Link to="/shop/product">Danh mục</Link>
            </Button>

            {isHovered && (
              <div className="absolute left-0 z-50 flex bg-white text-black shadow-xl w-[250px] rounded-bl-xl rounded-br-xl transition-all duration-200">
                <MenuItems />
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="flex items-center bg-white rounded-full px-3 py-1">
              <Search className="text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Bạn tìm gì..."
                className="flex-grow px-2 py-1 text-black outline-none bg-transparent border-white"
              />
            </div>
          </div>

          {/* Giỏ hàng & tài khoản */}
          <HeaderRightContent />
        </div>
      </header>
    </div>
  );
}

export default ShoppingHeader;
