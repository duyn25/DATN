import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from "@/components/ui/skeleton"

import PageWrapper from './components/common/page-wrapper'

import AuthLayout from './components/auth/layout'
import AuthLogin from './pages/auth/login'
import AuthRegister from './pages/auth/register'

import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminCategory from './pages/admin-view/category'
import AdminSpecification from './pages/admin-view/specification'
import AdminStatistics from './pages/admin-view/statistics'

import ShoppingLayout from './components/shopping-view/layout'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingListing from './pages/shopping-view/listing'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingCheckout from './pages/shopping-view/checkout'
import PaymentSuccessPage from './pages/shopping-view/payment-success'
import ProductDetailPage from './pages/shopping-view/product-details'
import SearchProducts from './pages/shopping-view/search'

import NotFound from './pages/not-found'
import UnauthPage from './pages/unauth-page'
import CheckAuth from './components/common/check-auth'


function App() {
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (isLoading) return <Skeleton className="w-[1000px] bg-black h-[600px]" />

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        {/* Auth */}
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path='login' element={<PageWrapper title="Đăng nhập"><AuthLogin /></PageWrapper>} />
          <Route path='register' element={<PageWrapper title="Đăng ký"><AuthRegister /></PageWrapper>} />
        </Route>

        {/* Admin */}
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path='dashboard' element={<PageWrapper title="Trang quản trị"><AdminDashboard /></PageWrapper>} />
          <Route path='products' element={<PageWrapper title="Trang quản trị"><AdminProducts /></PageWrapper>} />
          <Route path='category' element={<PageWrapper title="Trang quản trị"><AdminCategory /></PageWrapper>} />
          <Route path='specification' element={<PageWrapper title="Trang quản trị"><AdminSpecification /></PageWrapper>} />
          <Route path='orders' element={<PageWrapper title="Trang quản trị"><AdminOrders /></PageWrapper>} />
          <Route path='statistics' element={<PageWrapper title="Trang quản trị"><AdminStatistics /></PageWrapper>} />
        </Route>

        {/* Shop */}
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<PageWrapper title="Cửa hàng điện gia dụng"><ShoppingHome /></PageWrapper>} />
          <Route path='product' element={<PageWrapper title="Cửa hàng điện gia dụng"><ShoppingListing /></PageWrapper>} />
          <Route path='account' element={<PageWrapper title="Cửa hàng điện gia dụng"><ShoppingAccount /></PageWrapper>} />
          <Route path='checkout' element={<PageWrapper title="Cửa hàng điện gia dụng"><ShoppingCheckout /></PageWrapper>} />
          <Route path='payment-success' element={<PageWrapper title="Cửa hàng điện gia dụng"><PaymentSuccessPage /></PageWrapper>} />
          <Route path='product/:productId' element={<PageWrapper title="Cửa hàng điện gia dụng"><ProductDetailPage /></PageWrapper>} />
          <Route path='search' element={<PageWrapper title="Cửa hàng điện gia dụng"><SearchProducts /></PageWrapper>} />
        </Route>

        {/* Khác */}
        <Route path='/unauth-page' element={<PageWrapper title="Không có quyền truy cập"><UnauthPage /></PageWrapper>} />
        <Route path='*' element={<PageWrapper title="404 - Không tìm thấy trang"><NotFound /></PageWrapper>} />
      </Routes>
    </div>
  )
}

export default App
