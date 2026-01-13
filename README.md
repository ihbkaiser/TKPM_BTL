# Hệ thống đi chợ thông minh - TKPM 2025.1

Ứng dụng web hỗ trợ đi chợ và quản lý thực phẩm trong gia đình, gồm tủ lạnh, danh sách mua sắm, công thức, kế hoạch bữa ăn và thống kê. Hệ thống tách frontend (Vite + React) và backend (Node.js + Express) kết nối MongoDB.

## Tính năng chính
- Xác thực JWT, phân quyền USER/HOMEMAKER/ADMIN.
- Quản lý tủ lạnh, thực phẩm, đơn vị, danh mục.
- Danh sách mua sắm và nhắc nhở thực phẩm sắp hết hạn.
- Công thức nấu ăn và kế hoạch bữa ăn.
- Nhóm gia đình và chia sẻ dữ liệu nội bộ.
- Thống kê sử dụng và màn hình quản trị.


## Công nghệ
- Frontend: React 18, Vite, React Router, Tailwind CSS.
- Backend: Node.js, Express, Mongoose, JWT, Nodemailer, cron jobs.
- CSDL: MongoDB.

## Cấu trúc thư mục
- `backend`: API server, middleware, routes, services, scripts.
- `frontend`: giao diện web (Vite + React).
- `docs`: tài liệu thiết kế và sơ đồ.

## Thiết lập môi trường
Yêu cầu: Node.js >= 18, MongoDB.

### Backend
1) Cài dependency:
```bash
cd backend
npm install
```
2) Tạo/cập nhật file `backend/.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/test
PORT=5002
NODE_ENV=development
JWT_SECRET=change_me
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
3) Chạy server:
```bash
npm run dev
```

### Frontend
1) Cài dependency:
```bash
cd frontend
npm install
```
2) Tạo/cập nhật file `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5002/api
```
3) Chạy UI:
```bash
npm run dev
```

## Script tiện ích
Các script nằm ở `backend/src/scripts`:
- `seed.js`: tạo dữ liệu mẫu cơ bản.
- `seed-recipes.js`: seed công thức.
- `seed-statistics-data.js`: seed dữ liệu thống kê.
- `create-user.js`: tạo nhanh user.
- `reset-admin-password.js`: đặt lại mật khẩu admin.

