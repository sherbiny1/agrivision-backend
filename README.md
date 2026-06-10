# 🌿 AgriVision AI — Backend API

Smart farming intelligence platform powered by AI. Built with Node.js, Express, and MongoDB.

---

## 📋 Overview

AgriVision AI is a mobile-first agricultural assistant that helps farmers diagnose plant diseases, analyze soil conditions, and receive intelligent farming recommendations. This is the **backend REST API** that powers the Flutter mobile app.

### Key Features

- 🔐 **Authentication** — Register, login, email OTP verification, password reset
- 📱 **Plant Scanning** — Upload plant images for disease & pest detection
- 🌱 **Soil Analysis** — Survey-based soil testing with calculated moisture, fertility & pH
- 💡 **Smart Recommendations** — Dynamic irrigation, fertilization & crop suggestions
- 📊 **Dashboard** — Home stats, daily tasks, notifications
- 👨‍🌾 **Multi-Role** — Farmer, Agronomist, Admin with role-based access

---

## 🏗️ Project Structure

```
BE AGRI/
├── server.js                          # Entry point
├── package.json                       # Dependencies
├── .env                               # Environment variables (not in git)
├── .env.example                       # Environment template
├── FOR_FLUTTER_DEVELOPER.md           # Flutter integration guide
│
├── src/
│   ├── app.js                         # Express app setup & routes
│   │
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── emailService.js            # Brevo HTTP API email service
│   │
│   ├── controllers/
│   │   ├── authController.js          # Auth: register, login, OTP verify, password reset
│   │   ├── farmerController.js        # Farmer: scan, soil test, recommendations
│   │   ├── agronomistController.js    # Agronomist: validate diagnoses
│   │   └── adminController.js         # Admin: manage users, system stats
│   │
│   ├── events/
│   │   └── emailEvents.js             # Non-blocking email event emitter
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT token verification + email check
│   │   ├── roleMiddleware.js           # Role-based access control
│   │   └── uploadMiddleware.js         # Multer image upload (5MB limit)
│   │
│   ├── models/
│   │   ├── User.js                     # User with email verification fields
│   │   ├── Diagnosis.js                # Plant scan results
│   │   ├── FarmData.js                 # Soil test data
│   │   ├── Recommendation.js           # AI recommendations
│   │   ├── Notification.js             # User notifications
│   │   ├── Task.js                     # Daily farming tasks
│   │   └── KnowledgeBase.js            # Educational content
│   │
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth/*
│   │   ├── farmerRoutes.js             # /api/farmer/*
│   │   ├── agronomistRoutes.js         # /api/agronomist/*
│   │   └── adminRoutes.js              # /api/admin/*
│   │
│   └── views/
│       ├── verificationOTP.html        # Email verification OTP template
│       └── passwordResetEmail.html     # Password reset OTP template
│
└── uploads/                            # Uploaded plant images
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB)
- Brevo account with API key (for transactional emails)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd BE-AGRI

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `BREVO_API_KEY` | Brevo transactional email API key | `xkeysib-...` |
| `SENDER_EMAIL` | Verified sender email in Brevo | `your-email@gmail.com` |

---

## 📡 API Endpoints

### 🔓 Authentication (Public)

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password, role }` | Register & send 6-digit OTP to email |
| `POST` | `/api/auth/verify-email` | `{ email, code }` | Verify OTP code → returns JWT token |
| `POST` | `/api/auth/resend-verification` | `{ email }` | Resend new OTP code |
| `POST` | `/api/auth/login` | `{ email, password }` | Login (blocked if not verified → 403) |
| `POST` | `/api/auth/forgot-password` | `{ email }` | Send password reset code to email |
| `POST` | `/api/auth/verify-code` | `{ email, code }` | Verify password reset code |
| `POST` | `/api/auth/reset-password` | `{ email, code, newPassword }` | Reset password |

### 👨‍🌾 Farmer (Requires Token + Farmer Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/farmer/home` | Dashboard: stats, tasks, notifications |
| `GET` | `/api/farmer/profile` | User profile |
| `POST` | `/api/farmer/scan-plant` | Upload image for disease detection (multipart) |
| `GET` | `/api/farmer/diagnoses` | All plant scan results |
| `POST` | `/api/farmer/farm-data` | Submit soil survey |
| `GET` | `/api/farmer/recommendations` | AI farming recommendations |
| `GET` | `/api/farmer/soil-history` | Soil test history |
| `GET` | `/api/farmer/test-history` | Combined scan + soil history |
| `GET` | `/api/farmer/notifications` | All notifications |
| `POST` | `/api/farmer/notifications` | Create a notification |
| `PUT` | `/api/farmer/notifications/:id/read` | Mark notification as read |
| `GET` | `/api/farmer/tasks` | All tasks |
| `PUT` | `/api/farmer/tasks/:id/toggle` | Toggle task completion |
| `GET` | `/api/farmer/knowledge-base` | Educational articles |
| `PUT` | `/api/farmer/settings/language` | Update language preference |

### 🧑‍🔬 Agronomist (Requires Token + Agronomist Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agronomist/diagnoses/pending` | Get unvalidated diagnoses |
| `PUT` | `/api/agronomist/diagnoses/:id/validate` | Validate and add treatment notes |

### 🛡️ Admin (Requires Token + Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/users` | Get all users |
| `DELETE` | `/api/admin/users/:id` | Delete a user |
| `GET` | `/api/admin/system-stats` | System statistics |

---

## 🔐 Email Verification Flow

The app uses **OTP-based email verification** (6-digit code), designed for mobile apps:

```
Register → Email with OTP → Enter code in app → Verified → Login
```

1. User registers → receives 6-digit code via email
2. User enters code in app → `POST /verify-email`
3. If verified → JWT token returned, user can login
4. If code expired (10 min) → `POST /resend-verification`
5. Login is **blocked** (403) until email is verified

---

## 🔑 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Token is returned after:
- Successful email verification (`POST /verify-email`)
- Login (`POST /login`)

Token expires in **30 days**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express 5** | Web framework |
| **MongoDB + Mongoose** | Database |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Brevo API** | Transactional email sending |
| **Multer** | Image upload |
| **CORS** | Cross-origin support |

---

## 📦 Scripts

```bash
npm start      # Production server
npm run dev    # Development with auto-reload (nodemon)
```

---

## 📄 License

ISC
