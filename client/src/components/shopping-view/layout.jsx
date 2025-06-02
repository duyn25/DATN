import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import ChatBotBox from "./chatbot";


function ShoppingLayout() {
    return ( <div className="flex flex-col bg-[#f3f4f6] overflow-hidden">
        {/*common header*/}
        <ShoppingHeader/>
        <main className="flex flex-col w-full">
            <Outlet/>
        </main>
        <ChatBotBox />
        <Footer/>
    </div> );
}

export default ShoppingLayout;