# Restaurant Admin Panel 🍽️

Full-stack admin panel cho quản lý nhà hàng với kiến trúc OOP chuyên nghiệp.

## 📋 Tính năng

### Backend (Node.js + Express + TypeScript + SQLite)
- ✅ Xác thực JWT với phân quyền ADMIN
- ✅ Quản lý danh mục (Categories) - CRUD + soft delete
- ✅ Quản lý sản phẩm (Products) - CRUD + filters + toggle featured
- ✅ Quản lý đặt bàn (Reservations) - theo dõi trạng thái
- ✅ Quản lý đơn hàng (Orders) - workflow hoàn chỉnh + gán driver
- ✅ Quản lý tài xế (Drivers) - tạo driver + toggle active
- ✅ Kiến trúc OOP: Controller → Service → Repository
- ✅ Validation với Zod
- ✅ Seed data với admin mặc định

### Frontend (React + TypeScript + Vite + Tailwind CSS)
- ✅ Đăng nhập với JWT token
- ✅ Protected routes
- ✅ Admin layout (sidebar + topbar)
- ✅ Dashboard với thống kê
- ✅ CRUD pages cho tất cả modules
- ✅ Filters và search
- ✅ Modal forms
- ✅ API client với interceptors

## 🚀 Hướng dẫn chạy

### 1. Backend

```bash
cd backend

# Cài dependencies
npm install

# Tạo database và chạy migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Chạy seed để tạo admin user
npm run seed

# Chạy server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

**Default Admin Credentials:**
- Email: `admin@akedo.local`
- Password: `Admin@123`

### 2. Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 📁 Cấu trúc thư mục

### Backend
```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── src/
│   ├── config/             # Config & database
│   ├── common/
│   │   ├── enums/          # Enums
│   │   ├── middleware/     # Auth & error middleware
│   │   └── utils/          # Utilities (password, etc)
│   ├── modules/
│   │   ├── auth/           # Auth (login, me)
│   │   ├── categories/     # Categories CRUD
│   │   ├── products/       # Products CRUD + filters
│   │   ├── reservations/   # Reservations management
│   │   ├── orders/         # Orders management + driver assignment
│   │   └── users/          # Users/Drivers management
│   └── app.ts              # Main app
├── package.json
└── tsconfig.json
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminLayout.tsx # Layout với sidebar + topbar
│   │   └── ProtectedRoute.tsx # Route guard
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── ProductsPage.tsx
│   │   ├── ReservationsPage.tsx
│   │   ├── OrdersPage.tsx
│   │   └── DriversPage.tsx
│   ├── services/           # API services
│   │   ├── apiClient.ts    # Axios client với interceptors
│   │   ├── authService.ts
│   │   ├── categoryService.ts
│   │   ├── productService.ts
│   │   ├── reservationService.ts
│   │   ├── orderService.ts
│   │   └── userService.ts
│   ├── App.tsx             # Router config
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind + custom styles
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🔑 API Endpoints

### Auth
- `POST /admin/auth/login` - Đăng nhập
- `GET /admin/auth/me` - Lấy thông tin user hiện tại

### Categories (Admin only)
- `GET /admin/categories` - Lấy tất cả categories
- `POST /admin/categories` - Tạo category mới
- `PUT /admin/categories/:id` - Cập nhật category
- `PATCH /admin/categories/:id/toggle-active` - Toggle active status
- `DELETE /admin/categories/:id` - Soft delete category

### Products (Admin only)
- `GET /admin/products?search=&categoryId=&isActive=` - Lấy products với filters
- `POST /admin/products` - Tạo product mới
- `PUT /admin/products/:id` - Cập nhật product
- `PATCH /admin/products/:id/toggle-active` - Toggle active status
- `PATCH /admin/products/:id/toggle-featured` - Toggle featured status
- `DELETE /admin/products/:id` - Soft delete product

### Reservations (Admin only)
- `GET /admin/reservations?date=&status=` - Lấy reservations với filters
- `PATCH /admin/reservations/:id/confirm` - Xác nhận reservation
- `PATCH /admin/reservations/:id/cancel` - Hủy reservation
- `PATCH /admin/reservations/:id/complete` - Hoàn thành reservation

### Orders (Admin only)
- `GET /admin/orders?status=` - Lấy orders với filter
- `GET /admin/orders/:id` - Lấy chi tiết order
- `PATCH /admin/orders/:id/confirm` - Xác nhận order
- `PATCH /admin/orders/:id/preparing` - Chuyển sang đang chuẩn bị
- `PATCH /admin/orders/:id/ready` - Chuyển sang sẵn sàng
- `PATCH /admin/orders/:id/assign-driver` - Gán driver (body: {driverId})
- `PATCH /admin/orders/:id/cancel` - Hủy order

### Users/Drivers (Admin only)
- `GET /admin/users?role=DRIVER` - Lấy danh sách drivers
- `POST /admin/users` - Tạo driver mới
- `PATCH /admin/users/:id/toggle-active` - Toggle active status

## 📊 Database Schema

- **User**: id, name, email, passwordHash, role (ADMIN|DRIVER|USER), isActive, createdAt
- **Category**: id, name, isActive, createdAt
- **Product**: id, categoryId, name, description, price, imageUrl, isActive, isFeatured, createdAt
- **Reservation**: id, customerName, phone, datetime, guests, note, status, createdAt
- **Order**: id, customerId, customerName, phone, address, note, total, status, assignedDriverId, createdAt
- **OrderItem**: id, orderId, productId, qty, price

## 🎯 Business Rules

### Reservation Status Flow
- `NEW` → `CONFIRMED` → `COMPLETED`
- `NEW` hoặc `CONFIRMED` có thể → `CANCELED`
- `COMPLETED` không thể đổi ngược

### Order Status Flow
- `PENDING` → `CONFIRMED` → `PREPARING` → `READY` → `DELIVERING` → `COMPLETED`
- Có thể `CANCELED` trước khi `COMPLETED`
- Chỉ gán driver khi order ở trạng thái `READY`
- Sau khi gán driver, tự động chuyển sang `DELIVERING`

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express
- TypeScript
- Prisma ORM
- SQLite
- JWT (jsonwebtoken)
- bcrypt
- Zod (validation)

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router v6
- Axios
- Tailwind CSS

## 📝 Notes

- Tất cả endpoints `/admin/*` (trừ login) yêu cầu JWT token và role ADMIN
- Password được hash bằng bcrypt (10 rounds)
- Soft delete: categories/products set `isActive = false` thay vì xóa khỏi DB
- Token được lưu trong localStorage
- API client tự động attach Authorization header
- Khi token hết hạn, tự động redirect về login

## 🎨 UI Features

- Sidebar navigation với icons
- Responsive table layouts
- Modal forms cho create/update
- Status badges với màu sắc phân biệt
- Search và filter real-time
- Beautiful login page với gradient background
- Dashboard với stats cards

---

**Developed with ❤️ using OOP principles and clean architecture**
