import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({isAuthenticated, user, children}) {
    const location = useLocation();
    if(!isAuthenticated && 
        !(location.pathname.includes("/login")
        || location.pathname.includes("/register"))
    ){
        return <Navigate to ="/auth/login"/>;
    }
    if(isAuthenticated &&(location.pathname.includes('/login')||location.pathname.includes('/register'))){
        if(user?.role === 'admin'){
            return <Navigate to ="/admin/statistics"/>
        }
        else{
            return <Navigate to ="/shop/home"/>;
        }
    }
    if(isAuthenticated && user?.role !=='admin' && location.pathname.includes('admin')){
        return <Navigate to="/unauth-page"/>
    }
    if(isAuthenticated && user?.role==="admin" && location.pathname.includes("shop") ){
        return <Navigate to ="/admin/statistics"/>;
    }
    return <>{children}</>;
}

export default CheckAuth ;