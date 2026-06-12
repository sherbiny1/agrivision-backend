# AgriVision AI — Backend Presentation Guide

## 🌱 Project Overview

**AgriVision AI** is a smart agriculture backend API that helps farmers manage their crops through AI-powered plant disease scanning, soil analysis, and personalized recommendations. It supports 3 user roles: **Farmer**, **Agronomist**, and **Admin**.

- **GitHub**: https://github.com/sherbiny1/agrivision-backend
- **Tech Stack**: Node.js + Express.js + MongoDB
- **Architecture**: RESTful API (MVC Pattern)

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Server runtime |
| **Express.js v5** | Web framework |
| **MongoDB + Mongoose** | Database + ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **express-validator** | Input validation |
| **Nodemailer / Brevo API** | Email service (OTP codes) |
| **Multer** | Image upload handling |
| **CORS** | Cross-origin support |
| **dotenv** | Environment variables |

---

## 📁 Project Structure

```
BE AGRI/
├── server.js                      # Entry point — starts server & connects DB
├── package.json                   # Dependencies & scripts
├── .env                           # Environment variables (secret)
├── .env.example                   # Environment template
│
├── src/
│   ├── app.js                     # Express app setup, middleware, route mounting
│   │
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── emailService.js        # Brevo email API integration
│   │
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js                # User model (Farmer/Agronomist/Admin)
│   │   ├── Diagnosis.js           # Plant scan results
│   │   ├── FarmData.js            # Soil survey data
│   │   ├── Recommendation.js      # AI recommendations
│   │   ├── Notification.js        # User notifications
│   │   ├── Task.js                # Daily farming tasks
│   │   └── KnowledgeBase.js       # Educational articles
│   │
│   ├── controllers/               # Business logic
│   │   ├── authController.js      # Register, Login, Email verification, Password reset
│   │   ├── farmerController.js    # All farmer features (16 endpoints)
│   │   ├── agronomistController.js# Diagnosis validation
│   │   └── adminController.js     # User management & stats
│   │
│   ├── routes/                    # Route definitions
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── farmerRoutes.js        # /api/farmer/*
│   │   ├── agronomistRoutes.js    # /api/agronomist/*
│   │   └── adminRoutes.js         # /api/admin/*
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   ├── roleMiddleware.js      # Role-based access control
│   │   ├── validationMiddleware.js# Input validation (express-validator)
│   │   └── uploadMiddleware.js    # Image upload (Multer)
│   │
│   ├── events/
│   │   └── emailEvents.js         # Event-driven email sending (non-blocking)
│   │
│   └── views/                     # HTML email templates
│       ├── verificationOTP.html
│       └── passwordResetEmail.html
│
└── uploads/                       # Uploaded plant images
```

---

## 🔐 Authentication Flow

```
Register → Email OTP (6-digit) → Verify Email → Login → JWT Token → Access Protected Routes
```

### Detailed Flow:
1. **Register** (`POST /api/auth/register`) — creates user, sends 6-digit OTP to email
2. **Verify Email** (`POST /api/auth/verify-email`) — user submits OTP, email marked verified
3. **Login** (`POST /api/auth/login`) — only works if email is verified, returns JWT token
4. **All protected routes** require `Authorization: Bearer <token>` header

### Password Reset Flow:
1. `POST /api/auth/forgot-password` — sends 4-digit reset code to email
2. `POST /api/auth/verify-code` — verifies the reset code
3. `POST /api/auth/reset-password` — sets new password

---

## ✅ Input Validation System (express-validator)

Validation middleware runs **before** the controller — rejects bad input with clear error messages.

### Validation Rules:

| Field | Rules |
|---|---|
| **Name** | Required, 2-50 chars, letters/spaces/hyphens/apostrophes only |
| **Email** | Required, valid format, auto-normalized (lowercased, cleaned) |
| **Password** | Required, min 8 chars, at least 1 uppercase + 1 lowercase + 1 number |

### Error Response Example:
```json
{
  "message": "Validation failed",
  "errors": [
    "Password must be at least 8 characters",
    "Password must contain at least one uppercase letter"
  ]
}
```

### Routes with Validation:
- `POST /api/auth/register` → `validateRegister`
- `POST /api/auth/login` → `validateLogin`
- `POST /api/auth/reset-password` → `validateResetPassword`

---

## 📡 All API Endpoints (24 total)

### 🔓 Auth Routes — `/api/auth` (Public)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register new user (with validation) |
| POST | `/verify-email` | Verify email with 6-digit OTP |
| POST | `/resend-verification` | Resend verification code |
| POST | `/login` | Login (with validation) |
| POST | `/forgot-password` | Send password reset code |
| POST | `/verify-code` | Verify reset code |
| POST | `/reset-password` | Reset password (with validation) |

### 🧑‍🌾 Farmer Routes — `/api/farmer` (Protected: Farmer only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/home` | Dashboard: weather, stats, tasks, notifications |
| GET | `/profile` | Get user profile |
| POST | `/scan-plant` | Upload plant image for AI disease scan |
| GET | `/diagnoses` | Get all scan results |
| POST | `/farm-data` | Submit soil survey → generates recommendations |
| GET | `/recommendations` | Get all recommendations |
| GET | `/soil-history` | Get soil test history |
| GET | `/test-history` | Combined plant scan + soil test history |
| GET | `/notifications` | Get all notifications |
| POST | `/notifications` | Create a notification |
| PUT | `/notifications/:id/read` | Mark notification as read |
| GET | `/tasks` | Get daily tasks |
| PUT | `/tasks/:id/toggle` | Toggle task completion |
| GET | `/knowledge-base` | Get educational articles |
| PUT | `/settings/language` | Update language preference |

### 👨‍🔬 Agronomist Routes — `/api/agronomist` (Protected: Agronomist only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/diagnoses/pending` | View all pending diagnoses |
| PUT | `/diagnoses/:id/validate` | Validate diagnosis + add treatment notes |

### 🛡 Admin Routes — `/api/admin` (Protected: Admin only)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | Get all users |
| DELETE | `/users/:id` | Delete a user |
| GET | `/system-stats` | System statistics dashboard |

---

## 🔒 Security Features

| Feature | Implementation |
|---|---|
| **Password Hashing** | bcryptjs with salt rounds (10) — pre-save hook in User model |
| **JWT Authentication** | 30-day token, verified on every protected request |
| **Email Verification** | 6-digit OTP with 10-minute expiry |
| **Input Validation** | express-validator on register, login, reset-password |
| **Role-Based Access** | Middleware blocks unauthorized roles from accessing endpoints |
| **Email Verified Check** | Login blocked + protected routes blocked if email not verified |
| **File Upload Filter** | Only image MIME types allowed, 5MB max size |
| **Password Exclusion** | `-password` in all user queries (never returned to client) |

---

## 📊 Database Models (7 total)

| Model | Key Fields |
|---|---|
| **User** | name, email, password, role (Farmer/Agronomist/Admin), emailVerified, language |
| **Diagnosis** | farmerId, imageUrl, scanScore, healthStatus, pests[], diseases[], treatments |
| **FarmData** | farmerId, soil survey answers, calculated moisture/fertility/pH |
| **Recommendation** | farmerId, moistureTips, fertilizationTips, recommendedCrops, irrigationDashboard |
| **Notification** | farmerId, title, body, isRead |
| **Task** | farmerId, title, isCompleted |
| **KnowledgeBase** | title, content, daysAgo |

---

## 📧 Email System

- **Provider**: Brevo (SendinBlue) HTTP API — works on Railway/cloud without SMTP
- **Architecture**: Event-driven (EventEmitter) — emails send in background, API responds instantly
- **Templates**: Beautiful HTML templates in `src/views/`
- **Events**:
  - `sendVerificationOTP` — triggered on register & resend
  - `sendPasswordResetCode` — triggered on forgot-password

---

## 🎯 Key Technical Decisions (Discussion Talking Points)

1. **Why Express v5?** — Latest version with better error handling and async support
2. **Why express-validator over manual validation?** — Industry standard, built-in sanitizers, less code, battle-tested
3. **Why Event-driven emails?** — Non-blocking: user gets instant response, email sends in background
4. **Why Brevo API over SMTP?** — Works on serverless/cloud platforms (Railway) where SMTP ports are blocked
5. **Why role-based middleware?** — Clean separation of access control, reusable across routes
6. **Why MVC pattern?** — Clear separation of concerns: Models (data), Controllers (logic), Routes (endpoints)
7. **Why JWT with 30-day expiry?** — Good balance for mobile apps (Flutter) — users stay logged in

---

## 🧪 How to Test (for demo)

```bash
# 1. Register
POST /api/auth/register
Body: { "name": "Ahmed", "email": "ahmed@test.com", "password": "Test1234" }

# 2. Verify Email (use OTP from email/console)
POST /api/auth/verify-email
Body: { "email": "ahmed@test.com", "code": "123456" }

# 3. Login
POST /api/auth/login
Body: { "email": "ahmed@test.com", "password": "Test1234" }
→ Returns JWT token

# 4. Use token for protected routes
GET /api/farmer/home
Headers: { "Authorization": "Bearer <token>" }
```

---

## 💡 What Makes This Project Stand Out

- ✅ **Full auth system** with email verification (not just login/register)
- ✅ **3 user roles** with proper access control
- ✅ **Input validation** using industry-standard library
- ✅ **Event-driven architecture** for emails
- ✅ **Dynamic soil analysis** — calculates scores from survey answers
- ✅ **Auto-generated recommendations** based on soil data
- ✅ **Clean code structure** — MVC, middleware chain, separation of concerns
- ✅ **Production-ready** — deployed on Railway with Brevo email API
