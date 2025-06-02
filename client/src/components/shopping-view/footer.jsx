import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 border-t mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Thông tin cửa hàng */}
        <div>
          <p className="font-bold text-base mb-2">Điện Gia Dụng</p>
          <p>Cung cấp các sản phẩm chất lượng cao phục vụ gia đình bạn.</p>
          <p className="mt-2">Hotline: <strong>0123 456 789</strong></p>
        </div>

        {/* Danh mục */}
        <div>
          <p className="font-semibold mb-2">Danh mục</p>
          <ul className="space-y-1">
            <li>Trang chủ</li>
            <li>Sản phẩm</li>
            <li>Giới thiệu</li>
            <li>Liên hệ</li>
          </ul>
        </div>

        {/* Chính sách */}
        <div>
          <p className="font-semibold mb-2">Chính sách</p>
          <ul className="space-y-1">
            <li>Bảo hành</li>
            <li>Đổi trả</li>
            <li>Điều khoản</li>
            <li>Hỗ trợ</li>
          </ul>
        </div>

        {/* Kết nối */}
        <div>
          <p className="font-semibold mb-2">Kết nối với chúng tôi</p>
          <ul className="space-y-1">
            <li>Facebook</li>
            <li>Zalo</li>
            <li>Instagram</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} Cửa hàng điện gia dụng Hương Chinh
      </div>
    </footer>
  );
};

export default Footer;
