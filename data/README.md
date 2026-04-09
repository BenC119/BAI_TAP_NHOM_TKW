# Database Structure - Vanguard Hypercars

Folder `data` chứa các file JSON để quản lý dữ liệu ứng dụng.

## 📁 Cấu trúc các file

### `auth.json` - Quản lý xác thực người dùng
- **users**: Danh sách người dùng đã đăng ký
  - id: ID duy nhất
  - firstName, lastName: Họ tên
  - email: Email đăng nhập
  - phone: Số điện thoại
  - password: Mật khẩu (nên mã hóa)
  - role: Vai trò (customer, admin, staff)
  - isActive: Trạng thái hoạt động
  - isVerified: Đã xác minh email

- **sessions**: Lưu trữ phiên đăng nhập
- **passwordResets**: Quản lý khôi phục mật khẩu

### `product.json` - Quản lý sản phẩm/xe
- **products**: Danh sách siêu xe
  - id: ID sản phẩm
  - name, brand: Tên và hãng sản xuất
  - price: Giá bán
  - year: Năm sản xuất
  - specifications: Thông số kỹ thuật
  - inStock: Còn hàng hay không
  - quantity: Số lượng có sẵn

- **categories**: Danh mục sản phẩm

### `news.json` - Quản lý tin tức
- **news**: Danh sách bài viết tin tức
  - id, title, slug: ID, tiêu đề, URL slug
  - date, author: Ngày đăng, tác giả
  - category: Danh mục (Launch, News, Event, Review)
  - excerpt, content: Tóm tắt và nội dung đầy đủ
  - featured: Tin tức nổi bật

### `cart.json` - Quản lý giỏ hàng và đơn hàng
- **carts**: Giỏ hàng của người dùng
  - userId: ID người dùng
  - items: Danh sách sản phẩm trong giỏ
  - subtotal, tax, total: Tính toán giá

- **orders**: Danh sách đơn hàng
  - orderNumber: Mã đơn hàng
  - status: Trạng thái (pending, processing, shipped, delivered)
  - paymentMethod: Phương thức thanh toán
  - shippingAddress: Địa chỉ giao hàng

### `settings.json` - Cài đặt chung của trang
- **site**: Thông tin trang web
- **contact**: Thông tin liên hệ
- **social**: Các mạng xã hội
- **payment**: Thông tin thanh toán
- **features**: Các tính năng kích hoạt

## 🔐 Bảo mật

⚠️ **Lưu ý quan trọng**:
- `auth.json` chứa dữ liệu nhạy cảm - không commit vào git nếu cần
- Mật khẩu phải được mã hóa (bcrypt, argon2, ...)
- Không lưu token, API keys dạng plain text
- Sử dụng `.gitignore` để bảo vệ dữ liệu nhạy cảm

## 📝 Cách sử dụng

### Frontend (JavaScript)
```javascript
// Đọc dữ liệu
fetch('data/product.json')
  .then(res => res.json())
  .then(data => console.log(data.products));

// Lưu dữ liệu (cần backend)
const saveToJSON = (filename, data) => {
  // Gửi request POST tới server để lưu
};
```

### Backend (Node.js)
```javascript
const fs = require('fs');
const path = require('path');

// Đọc file
const readJSON = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Ghi file
const writeJSON = (filename, data) => {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};
```

## 🔄 Mở rộng trong tương lai

Có thể thêm các file JSON khác:
- `reviews.json` - Đánh giá sản phẩm
- `testimonials.json` - Lời chứng thực từ khách hàng
- `faqs.json` - Câu hỏi thường gặp
- `blog.json` - Blog bài viết
- `inventory.json` - Quản lý kho hàng
