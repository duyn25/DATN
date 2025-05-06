import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminCategory from './pages/admin-view/category'
import AdminSpecification from './pages/admin-view/specification'
import ShoppingLayout from './components/shopping-view/layout'
import NotFound from './pages/not-found'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import ProductDetailPage from './pages/shopping-view/product-details'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from "@/components/ui/skeleton"
import ShoppingAccount from './pages/shopping-view/account'


function App() {
  const {user, isAuthenticated,isLoading} =useSelector(state=>state.auth)
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(checkAuth());
  },[dispatch]);
  if(isLoading) return <Skeleton className="w-[800px] bg-black h-[600px]" />


  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      {}
      <Routes>
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user ={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
          <Route path='login' element={<AuthLogin/>}/>
          <Route path='register' element={<AuthRegister/>}/>
        </Route>
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user ={user}>
            <AdminLayout/>
          </CheckAuth>
          }>
          <Route path='dashboard' element={<AdminDashboard/>}/>
          <Route path='products' element={<AdminProducts/>}/>
          <Route path='category' element={<AdminCategory/>}/>
          <Route path='specification' element={<AdminSpecification/>}/>
          <Route path='orders' element={<AdminOrders/>}/>
        </Route>
        <Route>
          <Route path='/shop' element={
            <CheckAuth isAuthenticated={isAuthenticated} user ={user}>
            <ShoppingLayout/>
          </CheckAuth>
            }>
          <Route path='home' element={<ShoppingHome/>}/>
          <Route path='product' element={<ShoppingListing/>}/>
          <Route path='account' element={<ShoppingAccount/>}/>
          <Route path='product/:productId' element={<ProductDetailPage/>}/>


          </Route>
        </Route>
        <Route path='*' element={<NotFound/>}></Route>
        <Route path='/unauth-page' element={<UnauthPage/>}/>
      </Routes>
    </div>
  )
}

export default App
