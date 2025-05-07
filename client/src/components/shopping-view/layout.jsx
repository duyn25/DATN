import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";


function ShoppingLayout() {
    return ( <div className="flex flex-col bg-[#f3f4f6] overflow-hidden">
        {/*common header*/}
        <ShoppingHeader/>
        <main className="flex flex-col w-full">
            <Outlet/>
        </main>
        <Footer/>
    </div> );
}

export default ShoppingLayout;