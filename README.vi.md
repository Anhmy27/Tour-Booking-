# 🌍 Hệ Thống Quản Lý Đặt Tour Du Lịch (TBMS)

Một nền tảng đặt tour du lịch trực tuyến toàn diện được xây dựng với MERN stack (MongoDB, Express.js, React, Node.js). Hệ thống cho phép người dùng duyệt tour, đặt tour, viết đánh giá, đọc blog du lịch, và cung cấp cho quản trị viên các công cụ quản lý mạnh mẽ.

> **English Documentation**: See [README.md](./README.md) for English version

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt](#-hướng-dẫn-cài-đặt)
- [Biến Môi Trường](#-biến-môi-trường)
- [Tài Liệu API](#-tài-liệu-api)
- [Hướng Dẫn Phát Triển](#-hướng-dẫn-phát-triển)
- [Tính Năng Bảo Mật](#-tính-năng-bảo-mật)
- [Đóng Góp](#-đóng-góp)

## ✨ Tính Năng

### Tính Năng Người Dùng
- **Xác Thực & Phân Quyền**
  - Xác thực bằng JWT
  - Đăng nhập Google OAuth 2.0
  - Chức năng đặt lại mật khẩu
  - Quản lý phiên bảo mật

- **Quản Lý Tour**
  - Duyệt các tour có sẵn với bộ lọc và sắp xếp
  - Xem thông tin chi tiết tour với bản đồ tương tác (Leaflet)
  - Kiểm tra tình trạng và ngày khởi hành
  - Xem đánh giá từ người dùng khác

- **Hệ Thống Đặt Tour**
  - Đặt tour với lựa chọn ngày
  - Chỉ định số lượng người tham gia
  - Thanh toán an toàn qua Stripe
  - Xem lịch sử đặt tour
  - Tạo mã QR cho đặt chỗ

- **Hệ Thống Đánh Giá**
  - Viết đánh giá cho các tour đã hoàn thành
  - Đánh giá tour (1-5 sao)
  - Xem đánh giá từ khách du lịch khác

- **Nền Tảng Blog**
  - Đọc blog và bài viết du lịch
  - Duyệt bài đăng theo danh mục
  - Hỗ trợ trình soạn thảo Markdown

- **Hồ Sơ Người Dùng**
  - Cập nhật thông tin cá nhân
  - Xem lịch sử đặt tour
  - Quản lý cài đặt tài khoản

### Tính Năng Quản Trị Viên
- **Bảng Điều Khiển**
  - Phân tích doanh thu và biểu đồ
  - Thống kê đặt tour
  - Chỉ số người dùng
  - Theo dõi hiệu suất tour

- **Quản Lý Tour**
  - Tạo, cập nhật và xóa tour
  - Tải lên hình ảnh tour (tích hợp Cloudinary)
  - Quản lý lịch trình và tình trạng tour
  - Đặt giá và giảm giá

- **Quản Lý Đặt Tour**
  - Xem tất cả đặt chỗ
  - Tạo báo cáo
  - Theo dõi trạng thái thanh toán

- **Quản Lý Người Dùng**
  - Quản lý tài khoản người dùng
  - Gán vai trò và quyền
  - Xem hoạt động người dùng

- **Quản Lý Blog**
  - Tạo và chỉnh sửa bài đăng blog
  - Quản lý danh mục blog
  - Xuất bản/hủy xuất bản nội dung

- **Kiểm Duyệt Đánh Giá**
  - Giám sát và kiểm duyệt đánh giá
  - Xóa nội dung không phù hợp

## 🛠 Công Nghệ Sử Dụng

### Frontend
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.6.0
- **Thư Viện UI**:
  - Material-UI (MUI) 7.1.1
  - React Bootstrap 2.10.10
  - Tailwind CSS 3.4.17
  - Headless UI 2.2.4
- **Bản Đồ**: React Leaflet 5.0.0
- **Biểu Đồ**: Chart.js 4.5.0, Recharts 2.15.3
- **Form & Date Picker**: 
  - React DatePicker 8.4.0
  - MUI Date Pickers 8.5.2
- **Tính Năng Khác**:
  - Tạo mã QR
  - Trình soạn thảo Markdown
  - Swiper cho carousel
  - Axios cho API calls
  - Tích hợp Google OAuth

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB với Mongoose 8.10.1
- **Xác Thực**: 
  - JWT (jsonwebtoken 9.0.2)
  - Passport.js với Google OAuth 2.0
  - bcryptjs để mã hóa mật khẩu
- **Thanh Toán**: Stripe 17.7.0
- **Tải File**: 
  - Multer 1.4.5
  - Cloudinary 2.6.0
  - Sharp 0.33.5 (xử lý ảnh)
- **Bảo Mật**:
  - Helmet 8.0.0 (HTTP headers)
  - express-rate-limit 7.5.0
  - express-mongo-sanitize 2.2.0
  - xss-clean 0.1.4
  - hpp 0.2.3 (HTTP Parameter Pollution)
- **Email**: Nodemailer 6.10.0
- **Template Engine**: Pug 3.0.3
- **Khác**:
  - Morgan (logging)
  - Compression
  - Cookie Parser
  - Validator
  - Slugify

## 📁 Cấu Trúc Dự Án

```
Tour-Booking-/
├── Tour-Booking BE/          # Server API Backend
│   ├── config/               # File cấu hình
│   ├── controllers/          # Bộ điều khiển route
│   ├── models/               # Model Mongoose
│   ├── routes/               # Routes API
│   ├── utils/                # Hàm tiện ích
│   ├── public/               # File tĩnh
│   ├── app.js                # Cấu hình Express app
│   ├── server.js             # Điểm vào server
│   └── package.json
│
└── Tour-Booking FE/          # Ứng Dụng React Frontend
    ├── public/               # Tài nguyên công khai
    ├── src/
    │   ├── components/       # Component React tái sử dụng
    │   ├── contexts/         # React Context providers
    │   ├── hooks/            # Custom React hooks
    │   ├── layouts/          # Layout components
    │   ├── pages/            # Page components
    │   ├── routes/           # Cấu hình routes
    │   ├── services/         # Lớp service API
    │   └── App.js            # Root component
    └── package.json
```

Xem [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) để biết chi tiết đầy đủ.

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu

- Node.js (v14 trở lên)
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn
- Tài khoản Stripe (để thanh toán)
- Tài khoản Cloudinary (để tải ảnh)
- Google OAuth credentials (tùy chọn)

### Cài Đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/Anhmy27/Tour-Booking-.git
   cd Tour-Booking-
   ```

2. **Cài Đặt Dependencies Backend**
   ```bash
   cd "Tour-Booking BE"
   npm install
   ```

3. **Cài Đặt Dependencies Frontend**
   ```bash
   cd "../Tour-Booking FE"
   npm install
   ```

4. **Cấu Hình Biến Môi Trường**
   
   Tạo file `.env` trong thư mục `Tour-Booking BE` (xem phần [Biến Môi Trường](#-biến-môi-trường))

5. **Khởi Động Backend Server**
   ```bash
   cd "Tour-Booking BE"
   npm start
   ```
   Backend sẽ chạy tại `http://localhost:9999` (hoặc PORT bạn đã cấu hình)

6. **Khởi Động Frontend Development Server**
   ```bash
   cd "Tour-Booking FE"
   npm start
   ```
   Frontend sẽ chạy tại `http://localhost:3000`

## 🔐 Biến Môi Trường

Tạo file `.env` trong thư mục `Tour-Booking BE`:

```env
# Cấu Hình Server
NODE_ENV=development
PORT=9999

# Database
DATABASE=mongodb://localhost:27017/tour-booking
# HOẶC dùng MongoDB Atlas:
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/tour-booking

# Frontend URL
FRONT_END_URI=http://localhost:3000

# Cấu Hình JWT
JWT_SECRET=khoa-bi-mat-cua-ban
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Cấu Hình Email
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=username-email-cua-ban
EMAIL_PASSWORD=password-email-cua-ban
EMAIL_FROM=noreply@tourbooking.com

# Cấu Hình Stripe
STRIPE_SECRET_KEY=sk_test_khoa-stripe-cua-ban
STRIPE_WEBHOOK_SECRET=whsec_webhook-secret-cua-ban

# Cấu Hình Cloudinary
CLOUDINARY_CLOUD_NAME=ten-cloud-cua-ban
CLOUDINARY_API_KEY=api-key-cua-ban
CLOUDINARY_API_SECRET=api-secret-cua-ban

# Google OAuth (tùy chọn)
GOOGLE_CLIENT_ID=google-client-id-cua-ban.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=google-client-secret-cua-ban
GOOGLE_CALLBACK_URL=http://localhost:9999/api/v1/auth/google/callback
```

Xem file `.env.example` trong cả hai thư mục BE và FE để biết thêm chi tiết.

## 📚 Tài Liệu API

### Base URL
```
http://localhost:9999/api/v1
```

### Các Endpoint Chính

#### Xác Thực
- `POST /auth/signup` - Đăng ký người dùng mới
- `POST /auth/login` - Đăng nhập
- `POST /auth/logout` - Đăng xuất
- `POST /auth/forgotPassword` - Yêu cầu đặt lại mật khẩu
- `PATCH /auth/resetPassword/:token` - Đặt lại mật khẩu
- `GET /auth/google` - Đăng nhập Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

#### Tours
- `GET /tours` - Lấy tất cả tours (có lọc, sắp xếp, phân trang)
- `GET /tours/:id` - Lấy tour theo ID
- `POST /tours` - Tạo tour (chỉ admin/partner)
- `PATCH /tours/:id` - Cập nhật tour (chỉ admin/partner)
- `DELETE /tours/:id` - Xóa tour (chỉ admin)

#### Đặt Tour
- `GET /bookings` - Lấy tất cả đặt chỗ (chỉ admin)
- `GET /bookings/my-bookings` - Lấy đặt chỗ của người dùng hiện tại
- `POST /bookings` - Tạo đặt chỗ
- `GET /bookings/:id` - Lấy đặt chỗ theo ID
- `PATCH /bookings/:id` - Cập nhật đặt chỗ (chỉ admin)
- `DELETE /bookings/:id` - Hủy đặt chỗ

#### Đánh Giá
- `GET /reviews` - Lấy tất cả đánh giá
- `GET /tours/:tourId/reviews` - Lấy đánh giá cho tour cụ thể
- `POST /tours/:tourId/reviews` - Tạo đánh giá cho tour
- `PATCH /reviews/:id` - Cập nhật đánh giá
- `DELETE /reviews/:id` - Xóa đánh giá

#### Blogs
- `GET /blogs` - Lấy tất cả blogs
- `GET /blogs/:id` - Lấy blog theo ID
- `POST /blogs` - Tạo blog (chỉ admin)
- `PATCH /blogs/:id` - Cập nhật blog (chỉ admin)
- `DELETE /blogs/:id` - Xóa blog (chỉ admin)

## 👨‍💻 Hướng Dẫn Phát Triển

### Phong Cách Code

- **Backend**: Tuân theo best practices của Node.js
  - Sử dụng async/await cho các hoạt động bất đồng bộ
  - Triển khai xử lý lỗi đúng cách
  - Sử dụng ESLint: `npm run format`
  
- **Frontend**: Tuân theo best practices của React
  - Sử dụng functional components với hooks
  - Áp dụng component composition đúng cách
  - Sử dụng Prettier: `npm run format`

### Testing

- **Frontend**: Chạy test với `npm test`
- **Backend**: Tests có thể được thêm theo cấu trúc dự án

### Quy Trình Git

1. Tạo feature branch từ `main`
2. Thực hiện thay đổi
3. Chạy linters và tests
4. Commit với message mô tả rõ ràng
5. Push và tạo pull request

## 🔒 Tính Năng Bảo Mật

Ứng dụng này triển khai nhiều best practices về bảo mật:

1. **Xác Thực & Phân Quyền**
   - Xác thực dựa trên JWT
   - Mã hóa mật khẩu với bcrypt
   - Kiểm soát truy cập dựa trên vai trò

2. **Bảo Mật Dữ Liệu**
   - MongoDB sanitization (ngăn NoSQL injection)
   - Bảo vệ XSS
   - Ngăn chặn HTTP Parameter Pollution
   - Xác thực input với validator.js

3. **Bảo Mật HTTP**
   - Helmet.js cho HTTP headers an toàn
   - Cấu hình CORS
   - Rate limiting để ngăn brute force

4. **Bảo Mật Thanh Toán**
   - Tích hợp Stripe cho thanh toán an toàn
   - Xác minh chữ ký webhook

5. **Bảo Mật Session**
   - Xử lý cookie an toàn
   - Bắt buộc HTTPS trong production

## 🤝 Đóng Góp

Chào mừng các đóng góp! Vui lòng xem [CONTRIBUTING.md](./CONTRIBUTING.md) để biết hướng dẫn chi tiết.

### Quy Trình Đóng Góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/TinhNangMoi`)
3. Commit các thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request

## 📝 Giấy Phép

Dự án này được cấp phép theo ISC License.

## 👥 Tác Giả

- **Anhmy27** - [GitHub Profile](https://github.com/Anhmy27)

## 🙏 Lời Cảm Ơn

- Cộng đồng React và tài liệu
- Nhóm Express.js
- Nhóm MongoDB
- Tất cả những người đóng góp mã nguồn mở có package được sử dụng trong dự án này

## 📞 Hỗ Trợ

Để được hỗ trợ, vui lòng mở issue trên GitHub repository hoặc liên hệ với nhóm phát triển.

## 📖 Tài Liệu Bổ Sung

- [README.md](./README.md) - Phiên bản tiếng Anh
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Hướng dẫn đóng góp
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Cấu trúc dự án chi tiết

---

**Lưu ý**: Đây là dự án giáo dục/portfolio. Để triển khai production, hãy đảm bảo tất cả các biện pháp bảo mật được cấu hình đúng cách và các biến môi trường được quản lý an toàn.
