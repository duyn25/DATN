import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";


function AdminLayout() {
const [openSidebar, setopenSidebar] = useState(false)

    return ( <div className="flex min-h-screen w-full">
        {/*admin sidebar */}
        <AdminSideBar open={openSidebar} setOpen={setopenSidebar}/>
        <div className="flex flex-1 flex-col">
            {/*admin header*/}
            <AdminHeader setOpen={setopenSidebar}/>
            <main className="flex-1 flex-col flex bg-muted/40 md:p-6">
                <Outlet/>
            </main>
        </div>
    </div> );
}

export default AdminLayout;