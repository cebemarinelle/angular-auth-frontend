# 📚 Complete Project Documentation

## 📌 Project Overview

This is a **Full-Stack Authentication System** built with:
- **Frontend**: Angular 21 with Standalone Components
- **Backend**: Node.js + Express + MySQL
- **Email Service**: Brevo (Sendinblue) API
- **Database**: Aiven MySQL (Cloud) managed via DBeaver
- **Deployment**: Render (Frontend: Static Site, Backend: Web Service)

---

## 🔗 Live Demo Links

| Service | URL |
|---------|-----|
| **Frontend (Live App)** | [https://angular-auth-frontend.onrender.com](https://angular-auth-frontend.onrender.com) |
| **Backend API** | [https://angular-auth-backend-1-crp5.onrender.com](https://angular-auth-backend-1-crp5.onrender.com) |

---

## 📁 GitHub Repositories

| Repository | URL |
|------------|-----|
| **Frontend** | [https://github.com/cebemarinelle/angular-auth-frontend](https://github.com/cebemarinelle/angular-auth-frontend) |
| **Backend** | [https://github.com/cebemarinelle/angular-auth-backend](https://github.com/cebemarinelle/angular-auth-backend) |

---

## 🛠️ Tools & Technologies

### Development Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Code Editor |
| **DBeaver** | Database Management (MySQL client) |
| **XAMPP** | Local MySQL (optional) |
| **Git** | Version Control |
| **Postman** | API Testing (optional) |

### Frontend

| Technology | Version |
|------------|---------|
| Angular | 21.2.13 |
| Bootstrap | 5.2.3 |
| RxJS | 7.8.0 |
| TypeScript | 5.9.0 |

### Backend

| Technology | Version |
|------------|---------|
| Node.js | 22.22.3 |
| Express | 5.2.1 |
| MySQL2 | 3.14.0 |
| JWT | 9.0.3 |
| Bcryptjs | 3.0.3 |
| Nodemailer | 8.0.7 |

### Cloud Services

| Service | Purpose | Tier |
|---------|---------|------|
| **Aiven** | MySQL Database | Free |
| **Brevo** | Transactional Email API | Free (300 emails/day) |
| **Render** | Frontend + Backend Hosting | Free |

---

## 🚀 Features

- ✅ User Registration with Email Verification (Brevo)
- ✅ Login with JWT Authentication
- ✅ Refresh Token Mechanism (Cookie-based)
- ✅ Role-Based Authorization (Admin & User)
- ✅ Forgot Password / Reset Password
- ✅ Profile Management (View, Update, Delete)
- ✅ Admin Dashboard (Manage All Users)
- ✅ First Registered User becomes Admin
- ✅ Fully Deployed on Render (Free Tier)
- ✅ Modern Dark Ocean UI Theme

---

## 📋 Setup Instructions

### Prerequisites

- Node.js (v22+)
- Angular CLI (v21+)
- Git
- DBeaver (for database management)
- Brevo account (for email)
- Aiven account (for cloud MySQL)
- Render account (for deployment)

---

## 🔧 Backend Setup

### 1. Clone Backend Repository

```bash
git clone https://github.com/cebemarinelle/angular-auth-backend.git
cd angular-auth-backend
npm install
2. Create .env File
Create .env in root directory:

env
PORT=4000
NODE_ENV=development

# MySQL Database (Aiven)
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=your-port
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=defaultdb

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Cookie Settings
COOKIE_SECURE=false
COOKIE_SAMESITE=lax

# Brevo Email
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM=your-verified-email@gmail.com
CLIENT_URL=http://localhost:4200
3. Set Up Aiven MySQL Database
Go to Aiven.io and create free account

Click Create a new service → Select MySQL

Choose Free plan → Select region

Wait for deployment (2-3 minutes)

Copy the Service URI (connection string)

4. Connect DBeaver to Aiven MySQL
Open DBeaver

Click New Database Connection → Select MySQL

Choose URL connection type

Paste your Aiven Service URI:

text
jdbc:mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED
Go to Driver properties tab → Add:

allowPublicKeyRetrieval = true

useSSL = false

Click Test Connection → Should show "Connected"

Click Finish

5. Create Database Table
In DBeaver, open SQL editor and run:

sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(10) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('User', 'Admin') DEFAULT 'User',
  isVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(255),
  resetToken VARCHAR(255),
  resetTokenExpires DATETIME,
  refreshTokens JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
6. Set Up Brevo Email
Go to Brevo.com and create free account

Navigate to SMTP & API → API Keys → Generate new API key

Copy the API key (starts with xkeysib-)

Go to Senders & Domains → Senders → Add your email as sender

Verify your email via the link sent to your inbox

Add BREVO_API_KEY and EMAIL_FROM to .env file

7. Start Backend Server
bash
npm run dev
Expected output:

text
Server running on port 4000
🎨 Frontend Setup
1. Clone Frontend Repository
bash
git clone https://github.com/cebemarinelle/angular-auth-frontend.git
cd angular-auth-frontend
npm install
2. Update Environment Files
src/environments/environment.ts (Development):

typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000'
};
src/environments/environment.prod.ts (Production):

typescript
export const environment = {
  production: true,
  apiUrl: 'https://angular-auth-backend-1-crp5.onrender.com'
};
3. Start Frontend Server
bash
ng serve
Open http://localhost:4200

🚀 Deployment Guide
Deploy Backend to Render
Push backend code to GitHub

Login to Render

Click New + → Web Service

Connect your GitHub repository

Configure:

Setting	Value
Name	angular-auth-backend
Environment	Node
Build Command	npm install
Start Command	npm start
Add all environment variables from .env

Click Create Web Service

Deploy Frontend to Render
Push frontend code to GitHub

Click New + → Static Site

Connect your GitHub repository

Configure:

Setting	Value
Name	angular-auth-frontend
Build Command	npm ci && npm run build
Publish Directory	dist/angular-auth-frontend/browser
IMPORTANT: Add Redirect/Rewrite Rule

Field	Value
Source Path	/*
Destination Path	/index.html
Action	Rewrite
Click Create Static Site

🧪 Testing the Application
Test Registration Flow
Go to http://localhost:4200/account/register

Fill in registration form

Check email for verification link (from Brevo)

Click verification link

Login with credentials

Test Login
text
Email: your-registered-email@example.com
Password: your-password
Test Admin Access
First registered user becomes Admin

Admin can access /admin route

Admin can manage all users

Test Forgot Password
Go to /account/forgot-password

Enter email

Check email for reset link

Set new password

Login with new password

📁 Project Structure
Frontend Structure
text
angular-auth-frontend/
├── src/
│   ├── app/
│   │   ├── _components/        # Shared components (alert)
│   │   ├── _helpers/           # Guards, interceptors, validators
│   │   ├── _models/            # TypeScript interfaces
│   │   ├── _services/          # API services
│   │   ├── account/            # Auth pages (login, register, etc.)
│   │   ├── admin/              # Admin dashboard
│   │   ├── home/               # Home page
│   │   ├── profile/            # Profile management
│   │   ├── app.component.ts    # Root component
│   │   ├── app.config.ts       # App configuration
│   │   └── app.routes.ts       # Routing configuration
│   ├── environments/           # Environment configs
│   ├── index.html
│   ├── main.ts
│   └── styles.css              # Global styles (Dark Ocean theme)
├── angular.json
├── package.json
└── tsconfig.json
Backend Structure
text
angular-auth-backend/
├── src/
│   ├── config/
│   │   └── database.js         # MySQL connection
│   ├── controllers/
│   │   ├── accountController.js # User CRUD (Admin)
│   │   └── authController.js    # Auth endpoints
│   ├── middleware/
│   │   └── auth.js              # JWT verification
│   ├── models/
│   │   └── User.js              # User model
│   ├── routes/
│   │   └── accountRoutes.js     # API routes
│   ├── utils/
│   │   ├── brevo.js             # Email service
│   │   └── jwt.js               # Token utilities
│   └── app.js                   # Express app
├── .env                         # Environment variables
├── .env.example                 # Template for .env
├── server.js                    # Entry point
└── package.json
🔧 API Endpoints
Method	Endpoint	Description	Auth
POST	/accounts/register	Register new user	Public
POST	/accounts/verify-email	Verify email token	Public
POST	/accounts/authenticate	Login	Public
POST	/accounts/refresh-token	Refresh JWT	Public
POST	/accounts/revoke-token	Logout	Public
POST	/accounts/forgot-password	Request reset	Public
POST	/accounts/validate-reset-token	Validate reset token	Public
POST	/accounts/reset-password	Reset password	Public
GET	/accounts	Get all users	Admin
POST	/accounts	Create user	Admin
GET	/accounts/:id	Get user by ID	Auth
PUT	/accounts/:id	Update user	Auth
DELETE	/accounts/:id	Delete user	Auth
🗄️ Database Schema (DBeaver)
Users Table
sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(10) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('User', 'Admin') DEFAULT 'User',
  isVerified BOOLEAN DEFAULT FALSE,
  verificationToken VARCHAR(255),
  resetToken VARCHAR(255),
  resetTokenExpires DATETIME,
  refreshTokens JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Useful DBeaver Queries
sql
-- View all users
SELECT * FROM users;

-- Delete all users
DELETE FROM users;

-- Reset auto-increment
ALTER TABLE users AUTO_INCREMENT = 1;

-- Find user by email
SELECT * FROM users WHERE email = 'user@example.com';
⚠️ Known Issues & Solutions
Render Free Tier Cold Start
Issue: Backend spins down after 15 minutes of inactivity

First request takes 30-60 seconds to respond

Solution: Explain to instructor that this is normal for free tier

CORS Issues
Issue: Cross-origin requests blocked

Solution: Backend has CORS configured with FRONTEND_URL environment variable

Email Delivery
Issue: Emails may go to spam

Solution: Use Brevo with verified sender domain

DBeaver Connection Issues
Issue: "Public Key Retrieval is not allowed"

Solution: In Driver properties, add allowPublicKeyRetrieval=true and useSSL=false

👨‍💻 Author
Marinelle Cebe

🙏 Acknowledgments
Angular Documentation

Node.js Documentation

Render for free hosting

Brevo for email API

Aiven for free MySQL database

DBeaver for database management