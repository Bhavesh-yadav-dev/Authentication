# 🔐 User Authentication & Authorization System

A full-stack authentication system featuring a robust **Node.js/Express** backend with **MongoDB**, **JWT authentication**, **Bcrypt password hashing**, **Email verification (Nodemailer + Handlebars)**, and **Session tracking**.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
  - [1. User Registration](#1-user-registration)
  - [2. Email Verification](#2-email-verification)
  - [3. User Login](#3-user-login)
- [Environment Configuration](#environment-configuration)
- [Installation & Setup](#installation--setup)
- [Current Progress & Roadmap](#current-progress--roadmap)

---

## 📖 Overview

This project provides a secure, production-ready authentication flow:
1. Users register with basic details.
2. An HTML email with a verification token is sent automatically via Nodemailer and Handlebars.
3. Users verify their email token before they are permitted to log in.
4. On login, access tokens (15m) and refresh tokens (30d) are issued, and active sessions are updated in MongoDB.

---

## ✨ Key Features

- **Secure Password Hashing**: Passwords are encrypted using `bcrypt` (10 salt rounds) and hidden by default via Mongoose (`select: false`).
- **Email Verification Flow**: Automated verification link delivery using Handlebars email templates (`template.hbs`) and Gmail SMTP transporter.
- **JWT-Based Authentication**:
  - Verification tokens (15m expiration)
  - Access tokens (15m expiration)
  - Refresh tokens (30d expiration)
- **Email Verification Enforced**: Prevents unverified users from logging in with a `403 Forbidden` response.
- **Session Tracking**: Dedicated `Session` collection maintaining user session references via upsert operations.
- **Duplicate Prevention**: Protects against duplicate account creations with indexed email lookups.

---

## 🛠 Tech Stack

### Backend
- **Node.js** (ES Modules)
- **Express.js (v5)** — RESTful API routing and middleware
- **MongoDB & Mongoose (v9)** — Object Data Modeling (ODM)
- **JSON Web Tokens (`jsonwebtoken`)** — Stateless authentication & authorization
- **Bcrypt (`bcrypt`)** — Password encryption
- **Nodemailer & Handlebars** — Dynamic HTML email compilation and SMTP delivery
- **Dotenv** — Environment variable configuration
- **Nodemon** — Hot-reloading development server

### Frontend
- Located in `fontend/` (Planned/Under active setup).

---

## 📂 Project Architecture

```
authentication/
├── backend/
│   ├── controllers/
│   │   └── userControllers.js      # Core authentication handlers (register, verify, login)
│   ├── database/
│   │   └── db.js                   # MongoDB connection logic
│   ├── models/
│   │   ├── usermodel.js            # User Schema & configuration
│   │   └── sessionmodel.js         # Session Schema for user tracking
│   ├── routes/
│   │   └── userRoute.js            # Authentication API endpoints
│   ├── verifyEmail/
│   │   ├── template.hbs            # Handlebars HTML verification email template
│   │   └── verifyEmail.js          # Nodemailer transporter & template compiler
│   ├── .env                        # Local environment configuration (ignored in git)
│   ├── package.json                # Project dependencies and npm scripts
│   └── server.js                   # Application bootstrap and middleware setup
├── fontend/                        # Frontend client application folder
└── README.md                       # Project documentation
```

---

## 🗄 Database Schema

### 1. User Model (`models/usermodel.js`)
| Field | Type | Attributes | Description |
|---|---|---|---|
| `username` | String | Required, Trimmed | User's chosen display name |
| `email` | String | Required, Unique, Lowercase, Trimmed | User's unique email address |
| `password` | String | Required, Hidden (`select: false`) | Bcrypt-hashed password |
| `isVerified` | Boolean | Default: `false` | Email verification flag |
| `isLoggedIn` | Boolean | Default: `false` | Login status indicator |
| `token` | String | Hidden (`select: false`) | Temporary verification token |
| `otp` | String | Hidden (`select: false`) | Prepared for 2FA / OTP verification |
| `otpExpiry` | Date | Hidden (`select: false`) | Expiration timestamp for OTP |
| `createdAt` / `updatedAt` | Date | Timestamps | Auto-generated audit dates |

### 2. Session Model (`models/sessionmodel.js`)
| Field | Type | Reference | Description |
|---|---|---|---|
| `userId` | ObjectId | `User` | Foreign key referencing the active user |

---

## 🚀 API Documentation

**Base URL**: `http://localhost:<PORT>/user`

### 1. User Registration
Creates user record, hashes password, generates verification token, and emails verification link.

- **Endpoint**: `POST /register`
- **Request Body**:
  ```json
  {
    "username": "Bhavesh",
    "email": "bhavesh@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "userId": "671360..."
    }
    ```
  - `400 Bad Request`: Missing required fields.
  - `409 Conflict`: User already exists with that email.

---

### 2. Email Verification
Validates token from email and marks user account as verified.

- **Endpoint**: `POST /verify`
- **Header**:
  ```http
  Authorization: Bearer <TOKEN>
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "User verified successfully"
    }
    ```
  - `401 Unauthorized`: Token missing, malformed, or expired.
  - `404 Not Found`: User not found.

---

### 3. User Login
Authenticates verified users, generates session, and returns access and refresh tokens.

- **Endpoint**: `POST /login`
- **Request Body**:
  ```json
  {
    "email": "bhavesh@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi...",
      "user": {
        "id": "671360...",
        "username": "Bhavesh",
        "email": "bhavesh@example.com",
        "isVerified": true
      }
    }
    ```
  - `400 Bad Request`: Email or password omitted.
  - `401 Unauthorized`: Invalid email or incorrect password.
  - `403 Forbidden`: Email not verified.

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `backend/` folder with the following keys:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
SECRET_KEY=your_jwt_super_secret_key
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

> **Note**: For Gmail, generate an **App Password** under Google Account Security (with 2FA enabled) to use in `SMTP_PASS`.

---

## 💻 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd authentication
   ```

2. **Navigate to backend and install packages**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment**:
   Create and populate `backend/.env` as shown above.

4. **Start the backend server**:
   - For development with auto-reload:
     ```bash
     npm run dev
     ```
   - For production run:
     ```bash
     npm start
     ```

5. **Verify health check**:
   Open `http://localhost:5000/` in your browser. You should receive `"backend is working"`.

---

## 📈 Current Progress & Roadmap

- [x] Backend database connection with MongoDB & Mongoose
- [x] Registration controller with password hashing (`bcrypt`)
- [x] Email verification service using Handlebars template & Nodemailer
- [x] JWT token verification middleware/route
- [x] Login endpoint with verification guard & access/refresh token generation
- [x] Single-session tracking in MongoDB
- [ ] OTP / 2FA integration (schema fields already prepared)
- [ ] Password reset / forgot password flow
- [ ] Frontend client implementation (React/Next.js/Vite)
