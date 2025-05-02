import { HousePlus, LogOut, Menu, Search, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet } from "../ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useState } from "react";
function HeaderRightContent(){
    const {user} = useSelector(state=>state.auth);
    const[openCartSheet,setOpenCartSheet] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function handleLogout(){
        dispatch(logoutUser());
    }
    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}>
            <Button className="flex items-center bg-[#4390e3] hover:bg-white hover:text-black gap-1" onClick={()=>setOpenCartSheet(true)}>
                <ShoppingCart className="w-6 h-6 "/>
                <span className="">Giỏ hàng</span>
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
                <DropdownMenuContent side = "right" className="w-56">
                    <DropdownMenuLabel>{user?.userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={()=>navigate('/shop/account')}>
                        <UserCog className="mr-2 h-4 w-4"/>  Tài khoản
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/> Đăng xuất
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

function ShoppingHeader() {
    return ( 
    <div>
        <header className="sticky top-0 z-40 w-full border-b bg-[#4390e3] text-white">
            <div className="flex h-16 items-center justify-center px-4 md:px-6">
                <Link  to ="/shop/home" className="flex items-center gap-2">
                <HousePlus className="h-6 w-6"/>
                <span className="font-bold ">HC Store</span>
                </Link>
                <Button className="flex items-center bg-[#4390e3] hover:bg-white hover:text-black gap-1">
                <Menu size={20} />
                <span>Danh mục</span>
                </Button>
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
                <HeaderRightContent/>

            </div>
        </header>
    </div> 
);
}

export default ShoppingHeader;