# Student Companion

A full-stack campus management and placement assistance platform built for students and faculty. Students can track placement drives, access study materials, and manage todos. Faculty can post placement drives and share course materials.

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 19, Material-UI (MUI), React Router v7, Axios, Framer Motion |
| Backend    | Node.js, Express.js, Sequelize ORM             |
| Database   | Microsoft SQL Server (MSSQL)                    |
| Auth       | JWT (JSON Web Tokens), bcryptjs                 |
| Email      | Nodemailer (Gmail SMTP)                         |
| DevOps     | Docker, Docker Compose                          |

## Features

- **Student Registration & Login** with JWT authentication
- **Faculty Registration & Login** with role-based access
- **Placement Drives** — Faculty can create, update, and delete drives; students see drives filtered by their department
- **Study Materials** — Browse and access course materials by regulation, semester, and department
- **Todo Tracker** — Students can create, complete, and manage personal tasks with deadlines
- **Email Notifications** — Welcome email on registration, drive alerts to eligible students
- **Dashboard** — Role-specific dashboards for students and faculty

## Project Structure

```
student_companion/
├── backend/
│   ├── config/
│   │   ├── db.js              # Sequelize + MSSQL connection
│   │   └── constants.js       # Departments, roles, semesters, regulations
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── driveController.js
│   │   ├── materialController.js
│   │   └── todoController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── Student.js
│   │   ├── Faculty.js
│   │   ├── Drive.js
│   │   ├── Material.js
│   │   ├── Todo.js
│   │   └── index.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── driveRoutes.js
│   │   └── todoRoutes.js
│   ├── utils/
│   │   └── emailService.js     # Nodemailer email service
│   ├── server.js               # Entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── FacultyDashboard.js
│   │   │   ├── Materials.js
│   │   │   ├── TodoTracker.js
│   │   │   └── ResourcePage.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ResourceLibrary.js
│   │   ├── services/
│   │   │   └── api.js          # Axios instance with JWT interceptor
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or later) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Microsoft SQL Server** — [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Git** — [Download](https://git-scm.com/)

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/student_companion.git
cd student_companion
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 4. Set up the database

1. Open SQL Server Management Studio (SSMS) or Azure Data Studio
2. Create a new database:

```sql
CREATE DATABASE student_companion;
```

3. Make sure SQL Server is running and note down the port (default: `1433`)

### 5. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```bash
cd ../backend
touch .env
```

Add the following to `backend/.env`:

```env
PORT=5001
NODE_ENV=development

# MSSQL Database
DB_HOST=localhost
DB_PORT=1433
DB_NAME=student_companion
DB_USER=sa
DB_PASSWORD=your_database_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM="Student Companion <your-email@gmail.com>"
```

> **Note:** For `EMAIL_PASS`, you need a Gmail App Password, not your regular password.
> Go to [Google App Passwords](https://myaccount.google.com/apppasswords) to generate one (requires 2-Step Verification enabled).

### 6. Run the application

Open **two terminal windows**:

**Terminal 1 — Start the backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 — Start the frontend:**

```bash
cd frontend
npm start
```

The app will be available at:

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000         |
| Backend  | http://localhost:5001         |
| Health   | http://localhost:5001/api/health |

## Running with Docker

If you prefer Docker:

```bash
docker-compose up --build
```

This starts the backend service. Make sure your MSSQL instance is accessible from the container.

## API Endpoints

### Authentication
| Method | Endpoint                     | Description              |
|--------|------------------------------|--------------------------|
| POST   | `/api/auth/register/student` | Register a new student   |
| POST   | `/api/auth/login/student`    | Student login            |
| POST   | `/api/auth/register/faculty` | Register a new faculty   |
| POST   | `/api/auth/login/faculty`    | Faculty login            |

### Placement Drives
| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/drives`         | Create a drive (Faculty)           |
| GET    | `/api/drives/faculty` | Get all drives by faculty          |
| GET    | `/api/drives/student` | Get active drives for student      |
| PUT    | `/api/drives/:id`     | Update a drive (Faculty)           |
| DELETE | `/api/drives/:id`     | Delete a drive (Faculty)           |

### Todos
| Method | Endpoint           | Description               |
|--------|--------------------|---------------------------|
| POST   | `/api/todos`       | Create a todo             |
| GET    | `/api/todos`       | Get all todos for student |
| PUT    | `/api/todos/:id`   | Update a todo             |
| DELETE | `/api/todos/:id`   | Delete a todo             |

### Dashboard
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | `/api/dashboard`  | Get dashboard data   |

## Available Scripts

### Backend

```bash
npm start        # Start the server
npm run dev      # Start with nodemon (auto-reload)
```

### Frontend

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## Departments Supported

CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 already in use (macOS) | macOS uses 5000 for AirPlay. Use `PORT=5001` in `.env` |
| MSSQL connection refused | Ensure SQL Server is running and TCP/IP is enabled in SQL Server Configuration Manager |
| Email not sending | Verify Gmail App Password is correct and 2-Step Verification is enabled |
| CORS errors | Make sure `FRONTEND_URL` in `.env` matches your frontend URL |
