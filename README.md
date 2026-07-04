# Odoo HRMS Clone

A modern, multi-tenant Human Resources Management System (HRMS) designed for streamlined employee management, attendance tracking, leave requests, and payroll overview. Built with a React (Vite) frontend and a Node.js/Express backend running on PostgreSQL.

## 🚀 Features

- **Multi-Tenant Architecture**: Supports multiple companies natively. Each user and record is tied to a specific company context.
- **Authentication & RBAC**: Secure JWT-based authentication with Role-Based Access Control distinguishing between `Admin` and standard `Employee` roles.
- **Employee Directory**: Admins can manage their organization's employee directory, generate temporary secure passwords, and assign roles.
- **Attendance Tracking**: Real-time clock-in and clock-out functionality. Calculates daily working hours and logs the monthly status.
- **Leave Management**: Employees can apply for different types of leave (Paid, Sick, Unpaid). Managers/Admins can view and allocate leave balances.
- **Profile Management**: Detailed employee profiles including job titles, departments, contact info, and avatar uploads.
- **Modern UI/UX**: Fully responsive, professional interface built with Tailwind CSS, featuring glassmorphism elements, dynamic design tokens, and smooth micro-animations.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js powered by Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS with custom dynamic tokens
- **Icons**: Lucide React
- **API Communication**: Axios (with centralized interceptors for JWT injection)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **File Uploads**: Multer (configured for local `/uploads` storage)
- **Database Migrations**: node-pg-migrate

## 📋 Complete Workflow

1. **Company Onboarding (Sign Up)**:
   - A new organization registers via the `/signup` route, creating a unique Company Code.
   - The first user is automatically designated as the Company Admin.

2. **Employee Provisioning**:
   - The Admin navigates to the **Company Directory** and adds a new employee.
   - The system automatically generates a unique `Employee ID` (e.g., `ACME-1001`) and a secure temporary password.
   - The new employee logs in with this temporary password and is immediately prompted to securely reset it (Forced Password Reset workflow).

3. **Daily Operations**:
   - **Dashboard**: Upon login, employees see a personalized dashboard with quick actions.
   - **Attendance**: Employees navigate to the Attendance page to clock in at the start of the day and clock out at the end. The system logs the timestamps and automatically calculates the daily hours worked.
   - **Time Off**: Employees can request leave by selecting dates and types. They can also view their remaining allocated balances.

4. **Profile Maintenance**:
   - Users can update their contact details, avatar, and view their professional information (department, manager, join date).

## 💻 Running Locally

### Prerequisites
- Node.js (v16+)
- PostgreSQL Database (Local or Cloud like Neon/Supabase)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables (`backend/.env`):
   ```env
   PORT=8000
   DATABASE_URL=postgres://user:password@host:port/dbname
   JWT_SECRET=your_super_secret_key
   NODE_ENV=development
   ```
4. Run Database Migrations:
   ```bash
   npm run migrate up
   ```
5. Start the server:
   ```bash
   npm start
   ```
   *(Server will run on `http://localhost:8000`)*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *(App will run on `http://localhost:5173`)*

## 📂 Project Structure

```text
odoo/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Environment Configuration
│   │   ├── controllers/     # Route Logic (Auth, Admin, Attendance, etc.)
│   │   ├── middleware/      # JWT Verification & File Uploads
│   │   ├── routes/          # API Route Definitions
│   │   ├── utils/           # Helpers (Salary Calculators, Generators)
│   │   └── server.js        # Express App Entry Point
│   ├── migrations/          # PostgreSQL Schema Definitions
│   └── package.json
└── frontend/
    ├── public/              # Static Assets
    ├── src/
    │   ├── api/             # Axios Instance & Interceptors
    │   ├── components/      # Reusable UI (TopNav, ProtectedRoute)
    │   ├── context/         # React Context (Auth State)
    │   ├── pages/           # Application Views (Dashboard, Leave, etc.)
    │   ├── App.jsx          # Router Configuration
    │   └── index.css        # Tailwind Base & Custom UI Tokens
    └── package.json
```


## 🔒 Security

- All API routes (except login/signup) are protected by JWT middleware.
- Passwords are cryptographically hashed using `bcrypt` before storage.
- Employees logging in with temporary admin-generated passwords are forced to reset their credentials before gaining access to the dashboard.
- Data is strictly partitioned; SQL queries enforce `WHERE company_id = $1` to ensure data isolation between tenants.