# Hướng dẫn test Logout và Session

## Vấn đề đã sửa:

### 1. Admin logout không redirect về /login
✅ **Đã sửa**: AdminSidebar giờ dùng AuthContext, logout sẽ redirect về `/login`

### 2. Cookie vẫn lưu khi đóng trình duyệt

**Lưu ý quan trọng**: Trình duyệt Chrome/Edge có tính năng "Continue where you left off" (Tiếp tục từ nơi đã dừng) sẽ GIỮ LẠI session cookie.

#### Cách test đúng:

1. **Đăng xuất bằng nút Logout** (KHÔNG đóng tab)
2. Cookie sẽ bị xóa ngay lập tức
3. Bạn sẽ được redirect về `/login`

#### Nếu muốn test "đóng browser và mở lại":

**Option A - Tắt "Continue where you left off":**
1. Chrome: `Settings` → `On startup` → Chọn "Open the New Tab page"
2. Edge: `Settings` → `Start, home, and new tabs` → Chọn "Open the new tab page"

**Option B - Dùng Incognito/Private mode:**
1. Mở Incognito window (Ctrl+Shift+N)
2. Đăng nhập
3. Đóng toàn bộ Incognito windows
4. Mở lại → Phải đăng nhập lại

**Option C - Clear cookies manually:**
1. Đóng browser
2. Mở lại
3. Press F12 → Application tab → Cookies → Xóa cookie `jwt`
4. Refresh page

#### Nếu vẫn muốn cookie tự xóa khi đóng browser:

**Lưu ý**: Session cookie KHÔNG tự xóa nếu Chrome restore session. Để force xóa, cần set expires ngắn.

Uncomment dòng này trong `Tour-Booking BE/controllers/authController.js`:

```javascript
cookieOptions.expires = new Date(
  Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
);
```

Và đổi trong `.env`:
```
JWT_COOKIE_EXPIRES_IN=0.0007  # ~1 phút
```

**Nhưng điều này KHÔNG được khuyến khích** vì:
- User phải đăng nhập lại mỗi phút
- Trải nghiệm người dùng kém

## Recommended approach:

Giữ nguyên như hiện tại:
- ✅ Session cookie (xóa khi đóng browser THẬT SỰ, không restore)
- ✅ Logout button xóa cookie ngay lập tức
- ✅ Navigate về /login sau logout
- ✅ ProtectedRoute check role
- ✅ Clear localStorage và sessionStorage

## Kiểm tra sau khi sửa:

1. ✅ Đăng nhập admin → vào `/admin/dashboard`
2. ✅ Click Logout → redirect về `/login`
3. ✅ Đăng nhập partner → vào `/partner/dashboard`
4. ✅ Click Logout → redirect về `/login`
5. ✅ Đóng browser (tắt restore) → mở lại → phải login lại
