import {
  X,
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
import { useState, useRef } from "react";
import MenuItems from "./menu";
import UserCartWrapper from "./cart-wrapper";
import axios from "axios";

function HeaderSearchBox() {
  const [keyword, setKeyword] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setKeyword(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!val.trim()) {
      setSuggests([]);
      setShowDropdown(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shop/search/suggest?keyword=${encodeURIComponent(val)}`);
          console.log("Suggest response:", res.data);
        setSuggests(res.data.products || []);
        setShowDropdown(true);
      } catch {
        setSuggests([]);
        setShowDropdown(false);
      }
    }, 250);
  };

  const handleSearch = (val) => {
    setShowDropdown(false);
    if (val || keyword) {
      navigate(`/shop/search?keyword=${encodeURIComponent(val || keyword)}`);
      setKeyword(val || keyword);
    }
  };

 const handleSuggestClick = (item) => {
  setKeyword(item.productName);
  setShowDropdown(false);
  if (item.productId) {
    navigate(`/shop/product/${item.productId}`);
  } else {
    navigate(`/shop/search?keyword=${encodeURIComponent(item.productName)}`);
  }
};


  const handleFocus = () => {
    setInputFocused(true);
    if (keyword && suggests.length) setShowDropdown(true);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setInputFocused(false);
      setShowDropdown(false);
    }, 160); 
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        className="border border-gray-300 rounded-full px-5 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d9503f] transition placeholder:text-gray-400 bg-white text-gray-900"        placeholder="Tìm kiếm sản phẩm..."
        value={keyword}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        autoComplete="off"
        style={{ fontSize: 16 }}
      />
       {keyword && (
    <X
      size={20}
      className="absolute right-10 top-2.5 text-gray-400 cursor-pointer hover:text-[#d9503f] transition"
      onMouseDown={() => setKeyword("")}
     
    />
  )}
      <Search
        size={22}
        className="absolute right-4 top-2.5 text-gray-400 cursor-pointer hover:text-[#d9503f] transition"
        onClick={() => handleSearch()}
      />
      {/* Dropdown Suggest */}
      {inputFocused && showDropdown && suggests.length > 0 && (
        <div
          className="absolute left-0 right-0 top-12 bg-white border border-gray-200 shadow-xl rounded-2xl z-40 max-h-80 overflow-y-auto animate-fade-in"
        >
          {suggests.map((item, idx) => (
            <div
        key={item.productId || idx}
        className="flex items-center gap-3 px-4 py-3 hover:bg-[#fff5f3] cursor-pointer border-b last:border-b-0 transition-all"
        onMouseDown={() => handleSuggestClick(item)}

      >
  {/* Ảnh sản phẩm */}
  <img
    src={item.image || "/default-image.jpg"}
    alt={item.productName}
    className="w-14 h-14 object-cover rounded-lg border bg-gray-100 shadow"
  />
  {/* Thông tin sản phẩm */}
          <div className="flex-1">
            <div className=" text-[16px] text-gray-900 leading-5">{item.productName}</div>
            <div className="text-xs text-gray-500 mb-1">{item.brand}</div>
            <div className="flex gap-2 items-center">
              <span className="text-primary font-bold text-[14px]">
                {(item.salePrice > 0 ? item.salePrice : item.price).toLocaleString()} đ
              </span>
              {item.salePrice > 0 && (
                <>
                  <span className="text-gray-400 line-through text-[12px]">{item.price.toLocaleString()} đ</span>
                  <span className="text-red-500 text-xs font-semibold">
                    -{Math.round(100 - item.salePrice / item.price * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

          ))}
        </div>
      )}
    </div>
  );
}

// 2. Phần tài khoản & giỏ hàng
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
          <Avatar className="bg-[#7d161c] cursor-pointer shadow hover:scale-110 transition-all">
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
          className="flex items-center bg-[#7d161c] text-white hover:bg-[#b02e1e] gap-2 shadow transition-all"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">Giỏ hàng</span>
        </Button>
        <UserCartWrapper
          cartItems={cartItems?.items?.length > 0 ? cartItems.items : []}
        />
      </Sheet>
    </div>
  );
}

function ShoppingHeader() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#d9503f] to-[#b02e1e] text-white shadow-md border-b">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/shop/home" className="flex items-center gap-2 font-extrabold text-xl tracking-wide hover:scale-105 transition-all">
          <HousePlus className="w-7 h-7" />
          <span className="font-bold text-lg">HC Store</span>
        </Link>

        {/* Danh mục */}
        <div
          className="relative hidden md:block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-white shadow-lg transition-all duration-200 ${
              isHovered ? "bg-[#b02e1e] scale-105" : "bg-[#7d161c] hover:bg-[#b02e1e]"
            }`}
          >
            <Menu size={20} />
            <span>Danh mục</span>
          </Button>

          {isHovered && (
            <div className="absolute left-0 top-full w-[250px] bg-white text-black shadow-xl rounded-b-xl z-50">
              <MenuItems />
            </div>
          )}
        </div>

        {/* Thanh tìm kiếm đẹp */}
        <div className="flex-1 flex justify-center md:justify-start">
          <HeaderSearchBox />
        </div>

        {/* Giỏ hàng & tài khoản */}
        <HeaderRightContent />
      </div>
    </header>
  );
}

export default ShoppingHeader;

