import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Intro */}
        <div>
          <img
            src="https://cdn.tailgrids.com/2.0/image/assets/images/logo/logo.svg"
            alt="logo"
            className="mb-4 w-32"
          />
          <p className="text-sm">
            Cửa hàng chuyên cung cấp các sản phẩm điện gia dụng chất lượng cao.
          </p>
          <p className="mt-2 text-sm">Hotline: <strong>+012 (345) 678 99</strong></p>
        </div>

        {/* Danh mục chính */}
        <div>
          <h4 className="font-semibold mb-3">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Trang chủ</a></li>
            <li><a href="/shop/product" className="hover:underline">Sản phẩm</a></li>
            <li><a href="/about" className="hover:underline">Giới thiệu</a></li>
            <li><a href="/contact" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        {/* Thông tin */}
        <div>
          <h4 className="font-semibold mb-3">Thông tin</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Chính sách bảo hành</a></li>
            <li><a href="#" className="hover:underline">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:underline">Điều khoản dịch vụ</a></li>
            <li><a href="#" className="hover:underline">Hỗ trợ khách hàng</a></li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h4 className="font-semibold mb-3">Kết nối</h4>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-blue-500">Facebook</a>
            <a href="#" className="hover:text-blue-400">Zalo</a>
            <a href="#" className="hover:text-pink-500">Instagram</a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Cửa hàng điện gia dụng. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
};

export default Footer;
