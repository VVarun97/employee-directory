# StaffPulse — Enterprise Employee Directory

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)

A modern, high-performance, full-stack **Employee Directory Management System** designed to effortlessly manage, search, filter, paginate, and track team members across an enterprise.

Built with **React + TypeScript (Vite)** on the frontend and **Node.js (Express) + PostgreSQL** on the backend.

---

## 📸 Key Features

### 🌟 Core Requirements
- **Create Employee**: Add staff records with full validation (`name`, `email`, `role`).
- **Read / View Directory**: View all employees in a clean, responsive interface.
- **Update Employee**: Edit any employee's name, email, or role with instant live feedback.
- **Delete Employee**: Safely remove records with a double-check confirmation dialog.
- **Axios HTTP Client**: All API requests routed through a centralized Axios client with error handling.
- **CORS Enabled**: Configured on Express backend to allow cross-origin communication from Vite.

### 🚀 Bonus Enhancements (Implemented)
- **Instant Search**: Real-time filtering by employee name, email, or job role.
- **Role Filter Dropdown**: Filter workforce members by specialized discipline (Engineering, Design, Product, etc.).
- **Smart Pagination**: Full pagination controls with custom page size options (5, 10, 20, 50).
- **Dual View Layout**: Switch between **High-Density Table View** and **Modern Card Grid View**.
- **Dashboard Analytics**: Top KPI cards displaying Total Workforce, Active Roles, Top Department, and Latest Onboarding.
- **Light & Dark Theme**: Sleek toggle with auto-detection and `localStorage` persistence.
- **One-Click Email Copy**: Copy employee email to clipboard with instant checkmark animation.
- **Generative Avatars**: Deterministic gradient color palette & initials generated per employee name.
- **Form Validation**: Real-time validation for email regex format, required fields, and duplicate conflict handling.
- **Floating Toast Notifications**: Contextual alerts for creation, updates, deletions, and network status.
- **Live Health Monitor**: Automatic backend connection status pill in the navigation header.

---

## 🏗️ Architecture & Tech Stack

```
EmployeeDirectory/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # PostgreSQL connection pool & auto-schema init
│   │   ├── controllers/
│   │   │   └── employeeController.js  # CRUD operations & analytics logic
│   │   ├── routes/
│   │   │   └── employeeRoutes.js      # REST API route mapping
│   │   ├── scripts/
│   │   │   └── seed.js          # Database seeding script (12 team members)
│   │   └── server.js            # Express application entrypoint
│   ├── .env.example             # Environment variable template
│   ├── schema.sql               # PostgreSQL DDL table schema
│   ├── seed.sql                 # Sample SQL seed queries
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── employeeApi.ts   # Axios API client
│   │   ├── components/
│   │   │   ├── Navbar.tsx       # Brand header, theme switch, connection pill
│   │   │   ├── StatsCards.tsx   # Dashboard metric KPI cards
│   │   │   ├── FilterBar.tsx    # Search, role filter, sort, layout toggle
│   │   │   ├── EmployeeTable.tsx # High-density data table
│   │   │   ├── EmployeeCards.tsx # Card grid layout alternative
│   │   │   ├── EmployeeModal.tsx # Add / Edit employee modal with validation
│   │   │   ├── DeleteConfirmModal.tsx # Safe delete confirmation modal
│   │   │   ├── Pagination.tsx   # Dynamic page numbers & limits
│   │   │   ├── ToastNotification.tsx # Toast alerts system
│   │   │   └── EmptyState.tsx   # Zero-state placeholder
│   │   ├── types/
│   │   │   └── employee.ts      # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── helpers.ts       # Initials, gradients, role badges, date formatter
│   │   ├── App.tsx              # Root controller component
│   │   ├── index.css            # Modern glassmorphism design system
│   │   └── main.tsx             # React DOM root
│   ├── vite.config.ts           # Vite server configuration & API proxy
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema

The database uses PostgreSQL with the exact required schema:

```sql
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search and sorting performance indexes
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at DESC);
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Query / Body Params |
|--------|----------|-------------|---------------------|
| `GET` | `/employees` | Fetch employees (supports search & pagination) | `?search=...&role=...&page=1&limit=10&sortBy=created_at&sortOrder=DESC` |
| `GET` | `/employees/:id` | Fetch single employee by ID | — |
| `POST` | `/employees` | Add a new employee | `{ "name": "...", "email": "...", "role": "..." }` |
| `PUT` | `/employees/:id` | Update an existing employee | `{ "name": "...", "email": "...", "role": "..." }` |
| `DELETE` | `/employees/:id` | Delete an employee record | — |
| `GET` | `/employees/stats/summary` | Fetch dashboard analytics | — |
| `GET` | `/api/health` | Service health status check | — |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or later)
- **PostgreSQL** running locally on port `5432`

---

### Step 1: Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd EmployeeDirectory
```

---

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Configure your `.env` file (one is already prepared or copy `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=employee_directory
```

Run database seeder (populates 12 initial team records):
```bash
npm run seed
```

Start the backend server:
```bash
npm start
# Server starts at http://localhost:5000
```

---

### Step 3: Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
# Vite runs at http://localhost:5174
```

Open your browser and navigate to:
```
http://localhost:5174
```

---

## 🧪 Testing the Application

1. **Add Employee**: Click **"+ Add Employee"**, enter Name, Email, and select/type a Job Role, then click **"Add Employee"**.
2. **Search**: Type in the search box to filter by name, role, or email in real-time.
3. **Filter by Role**: Select any role (e.g. "Senior Full Stack Engineer", "UI/UX Designer") from the dropdown.
4. **Edit**: Click the pencil icon on any record to update information.
5. **Delete**: Click the trash icon on any record, confirm the prompt, and watch the directory update instantly.
6. **Toggle Layout**: Click the grid icon in the toolbar to switch to Card Grid mode.
7. **Toggle Theme**: Click the sun/moon icon in the header to switch between Dark and Light mode.

---

## 📦 Pushing to GitHub

To push this project to a new public GitHub repository:

```bash
# 1. Initialize git (if not already done)
git init
git add .
git commit -m "feat: complete basic employee directory with full-stack CRUD, search, pagination, and modern UI"

# 2. Add your GitHub remote repository
git remote add origin https://github.com/<your-username>/employee-directory.git
git branch -M main

# 3. Push to GitHub
git push -u origin main
```

---

## 📄 License
MIT License. Built for full-stack developer assessment.
