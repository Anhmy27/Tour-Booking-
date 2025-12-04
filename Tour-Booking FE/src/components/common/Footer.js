const Footer = () => {
  return (
    <footer className="bg-[#0E1B33] text-white pt-10 pb-6 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Cột 1: Logo + địa chỉ */}
        <div>
          <img src="/assets/fvivu.png" alt="fvivu" className="h-10 mb-4" />
          <p>Công ty TNHH Du Lịch và Dịch Vụ fvivu</p>
          <p className="mt-2 text-sm">
            Trường Đại Học FPT <br />
            Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, huyện Thạch Thất,
            Hà Nội
          </p>
        </div>

        {/* Cột 2: Giới thiệu */}
        <div>
          <h3 className="font-semibold mb-3">GIỚI THIỆU</h3>
          <ul className="space-y-2 text-sm">
            <li>Về chúng tôi</li>
            <li>Điều khoản và điều kiện</li>
            <li>Chính sách riêng tư</li>
            <li>Hướng dẫn sử dụng</li>
            <li>Hình thức thanh toán</li>
            <li>Liên hệ</li>
            <li>Hotline: 0922222016</li>
            <li>Email: info@fvivu.com</li>
          </ul>
        </div>

        {/* Cột 3: Điểm đến */}
        <div>
          <h3 className="font-semibold mb-3">ĐIỂM ĐẾN</h3>
          <ul className="space-y-2 text-sm">
            <li>Vịnh Hạ Long</li>
            <li>Vịnh Lan Hạ</li>
            <li>Đảo Cát Bà</li>
          </ul>
        </div>

        {/* Cột 4: Du thuyền */}
        <div>
          <h3 className="font-semibold mb-3">DU THUYỀN</h3>
          <ul className="space-y-2 text-sm">
            <li>Blog</li>
            <li>Quy định chung và lưu ý</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
