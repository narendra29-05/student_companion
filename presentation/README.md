# Campus Placement Portal (CPP) — Presentation Guide

> **IMPORTANT**: Narendra is unable to attend the presentation. Ajay, Kalyan, and Tanisha will present the entire project. Each of you has a dedicated file below — READ IT FULLY before the presentation. Everything is explained from scratch.

---

## What Is This Project?

**Campus Placement Portal (CPP)** is a full-stack web application built to solve real problems students and faculty face in colleges:

- Students miss placement drive announcements
- No central place for study materials (everyone shares PDFs on WhatsApp)
- Faculty has no way to assign and track assignments digitally
- Students have no way to track their tasks and deadlines

**Our Solution**: A single platform where:
- **Faculty** can post placement drives, create assignments, and track submissions
- **Students** can browse drives, apply, access study materials, submit assignments, manage to-dos, and track attendance

---

## Tech Stack (EVERYONE Must Know This)

### Frontend (What the user sees)
| Technology | What It Does | Why We Used It |
|-----------|-------------|---------------|
| **React.js** | JavaScript library for building user interfaces | Component-based, fast rendering, industry standard |
| **Material UI (MUI)** | Pre-built UI components (buttons, cards, forms, etc.) | Professional look without writing CSS from scratch |
| **Framer Motion** | Animation library | Smooth page transitions, hover effects, scroll animations |
| **Axios** | HTTP client library | Makes API calls from frontend to backend |
| **React Router** | Page navigation | Allows multiple pages in a single-page app |

### Backend (Server that handles logic)
| Technology | What It Does | Why We Used It |
|-----------|-------------|---------------|
| **Node.js** | JavaScript runtime for server | Same language (JS) on both frontend and backend |
| **Express.js** | Web framework for Node.js | Handles routes, middleware, API endpoints easily |
| **Sequelize** | ORM (Object-Relational Mapping) | Write database queries using JavaScript instead of raw SQL |
| **SQL Server (MSSQL)** | Relational database | Stores all data (students, drives, assignments, etc.) |
| **JWT (JSON Web Token)** | Authentication tokens | Keeps users logged in securely without sessions |
| **bcrypt** | Password hashing | Encrypts passwords so they're never stored as plain text |
| **Nodemailer** | Email sending library | Sends automated emails (notifications, reminders) |
| **Multer** | File upload middleware | Handles resume and profile picture uploads |
| **node-cron** | Task scheduler | Runs daily deadline reminder emails at 8 AM |

### How They Connect
```
User opens browser
    ↓
React Frontend (runs on port 3000)
    ↓ sends API requests via Axios
Express Backend (runs on port 5001)
    ↓ queries database via Sequelize
SQL Server Database
    ↓
Returns data back up the chain to the user
```

---

## Project Structure (Where Files Are)

```
student_companion/
├── backend/                    ← SERVER CODE
│   ├── config/
│   │   ├── db.js              ← Database connection setup
│   │   └── constants.js       ← Departments, semesters, regulations
│   ├── controllers/           ← Business logic (what happens when API is called)
│   │   ├── authController.js  ← Login & Register logic
│   │   ├── driveController.js ← Placement drive CRUD
│   │   ├── assignmentController.js ← Assignment + submission logic
│   │   ├── studentController.js    ← Profile, resume, photo
│   │   ├── todoController.js       ← To-do task CRUD
│   │   ├── materialController.js   ← Study materials filter
│   │   └── dashboardController.js  ← Unified dashboard data
│   ├── models/                ← Database table definitions
│   │   ├── Student.js         ← Student table
│   │   ├── Faculty.js         ← Faculty table
│   │   ├── Drive.js           ← Placement drive table
│   │   ├── DriveApplication.js← Student-drive applications
│   │   ├── Assignment.js      ← Assignment + AssignmentStudent tables
│   │   ├── Submission.js      ← Assignment submissions
│   │   ├── Todo.js            ← To-do tasks
│   │   ├── Material.js        ← Study materials + units
│   │   └── index.js           ← All model associations (foreign keys)
│   ├── middleware/
│   │   ├── authMiddleware.js  ← JWT token verification
│   │   ├── upload.js          ← File upload config
│   │   └── errorHandler.js    ← Global error handling
│   ├── routes/                ← URL endpoint definitions
│   ├── utils/
│   │   └── emailService.js    ← All email templates & sending
│   ├── seedMaterials.js       ← Script to populate 230+ study materials
│   └── server.js              ← Main entry point (starts everything)
│
├── frontend/                   ← CLIENT CODE
│   └── src/
│       ├── components/
│       │   ├── Navbar.js      ← Navigation bar (top of every page)
│       │   └── ApplyDialog.js ← Drive application popup
│       ├── context/
│       │   └── AuthContext.js ← Global auth state (logged in user, token)
│       ├── pages/
│       │   ├── Home.js        ← Landing page with animations
│       │   ├── Login.js       ← Login page
│       │   ├── Register.js    ← Registration page
│       │   ├── StudentDashboard.js  ← Student drive browsing
│       │   ├── FacultyDashboard.js  ← Faculty drive management
│       │   ├── StudentAssignments.js← Student assignment view
│       │   ├── FacultyAssignments.js← Faculty assignment management
│       │   ├── StudentProfile.js    ← Profile + resume upload
│       │   ├── Materials.js         ← Study materials browser
│       │   ├── TodoTracker.js       ← Task manager
│       │   └── ResourcePage.js      ← External resource viewer
│       ├── services/
│       │   └── api.js         ← Axios instance with JWT interceptor
│       └── App.js             ← Route definitions
```

---

## Team Responsibilities

| # | Presenter | What You Present | Your File | Duration |
|---|-----------|-----------------|-----------|----------|
| 1 | **Kalyan** | Project intro + Tech stack + Auth + Student Profile | [kalyan-preparation.md](./kalyan-preparation.md) | 7-8 min |
| 2 | **Ajay** | Placement Drives (Faculty creates + Student applies) | [ajay-preparation.md](./ajay-preparation.md) | 6-7 min |
| 3 | **Tanisha** | Assignments + Study Materials + Emails + Closing | [tanisha-preparation.md](./tanisha-preparation.md) | 7-8 min |

**Total: ~20-25 minutes + 5 min Q&A**

### Presentation Order:
1. **Kalyan starts** — introduces the project, explains tech stack, shows registration/login, shows student profile
2. **Ajay next** — shows how faculty creates drives, how students browse and apply
3. **Tanisha closes** — shows assignments, study materials, email notifications, wraps up

---

## How to Run the Project Locally

### Prerequisites
- Node.js installed (v18+)
- SQL Server running locally
- npm (comes with Node.js)

### Steps
```bash
# 1. Clone the repo
git clone https://github.com/narendra29-05/student_companion.git
cd student_companion

# 2. Install backend dependencies
cd backend
npm install

# 3. Create .env file in backend/ (ask Narendra for the .env file)

# 4. Start backend
npm run dev
# Should say: "MSSQL Database connected successfully" and "Server running on port 5001"

# 5. Open new terminal — Install frontend dependencies
cd frontend
npm install

# 6. Start frontend
npm start
# Opens browser at http://localhost:3000
```

### Test Accounts (if already seeded)
- **Student**: Register a new student with any roll number
- **Faculty**: Register a new faculty with any faculty ID

---

## Common Questions Panel Might Ask

1. **"What problem does this solve?"**
   → Students miss placement announcements, materials are scattered on WhatsApp, no digital assignment system. This centralizes everything.

2. **"Why React + Node.js?"**
   → Full JavaScript stack — same language on frontend and backend. Large ecosystem, industry standard, fast development.

3. **"Why SQL Server instead of MongoDB?"**
   → Our data is relational (students have assignments, assignments have submissions, drives have applications). SQL enforces data integrity with foreign keys.

4. **"How is security handled?"**
   → Passwords hashed with bcrypt (never stored in plain text). JWT tokens for authentication. Rate limiting on login (20 attempts per 15 min). Role-based middleware guards.

5. **"Can this scale?"**
   → Yes. Sequelize ORM supports connection pooling (10 concurrent connections). Backend is stateless. Can be containerized with Docker.

6. **"What makes it unique?"**
   → Auto-eligibility checking for drives (CGPA, backlogs, department), real-time deadline countdown, automated email notifications, and a unified student dashboard.

---

## Key Numbers to Remember

| Metric | Value |
|--------|-------|
| Frontend pages | 11 |
| Backend API endpoints | 20+ |
| Database models | 8 main + 3 junction tables |
| Study materials | 230+ units across 49 subjects |
| Regulations supported | R20, R23 |
| Semesters | 1-1 through 4-2 (8 total) |
| Departments | CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML |
| Email notifications | 7 types (welcome, drive, assignment, submission, reminders) |

---

**Read your individual file carefully. Good luck with the presentation!**
— Narendra
