# Campus Placement Portal — Architecture & Plan

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, MUI 7, React Router v7, Axios, Framer Motion |
| Backend | Node.js, Express.js 4.18 |
| Database | Microsoft SQL Server (MSSQL) via Sequelize 6 ORM |
| Auth | JWT (7-day expiry) + bcryptjs password hashing |
| Email | Nodemailer (Gmail SMTP) + node-cron for scheduled reminders |
| File Upload | Multer (resumes: 5MB, profile pics: 2MB) |
| DevOps | Docker + Docker Compose |

---

## Directory Structure

```
student_companion/
├── backend/
│   ├── config/
│   │   ├── db.js                  # Sequelize MSSQL connection
│   │   └── constants.js           # Departments, roles
│   ├── controllers/
│   │   ├── authController.js      # Student & Faculty registration/login
│   │   ├── dashboardController.js # Dashboard data aggregation
│   │   ├── driveController.js     # Drive CRUD, eligibility, applications
│   │   ├── materialController.js  # Study materials filtering
│   │   ├── studentController.js   # Profile & file upload handling
│   │   └── todoController.js      # Todo CRUD
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification (protectStudent/protectFaculty)
│   │   ├── errorHandler.js        # Global error handler
│   │   └── upload.js              # Multer config for resume & profile pic
│   ├── models/
│   │   ├── Student.js             # Student entity (bcrypt hooks)
│   │   ├── Faculty.js             # Faculty entity
│   │   ├── Drive.js               # Drive + DriveEligibleDepartment
│   │   ├── DriveApplication.js    # Student-Drive join (status tracking)
│   │   ├── Material.js            # Material + MaterialUnit
│   │   ├── Todo.js                # Per-student tasks
│   │   └── index.js               # Associations & DB sync
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── driveRoutes.js         # /api/drives/*
│   │   ├── studentRoutes.js       # /api/student/*
│   │   ├── todoRoutes.js          # /api/todos/*
│   │   └── dashboardRoutes.js     # /api/dashboard
│   ├── utils/
│   │   └── emailService.js        # Email templates + cron scheduler
│   ├── uploads/                   # resumes/ + profilepics/
│   ├── server.js                  # Express entry point
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js     # Global auth state (login, logout, register)
│   │   ├── pages/
│   │   │   ├── Home.js            # Landing page (dark/light, orbital UI)
│   │   │   ├── Login.js           # Role-based login
│   │   │   ├── Register.js        # Role-based registration
│   │   │   ├── StudentDashboard.js# Drive listing, eligibility, apply
│   │   │   ├── StudentProfile.js  # Profile + resume + profile pic
│   │   │   ├── FacultyDashboard.js# Drive management CRUD
│   │   │   ├── Materials.js       # Study materials browser
│   │   │   ├── TodoTracker.js     # Task manager (dark/light mode)
│   │   │   └── ResourcePage.js    # External resource links
│   │   ├── components/
│   │   │   ├── Navbar.js          # Nav bar with hamburger menu (mobile)
│   │   │   ├── ApplyDialog.js     # Drive application dialog
│   │   │   └── ResourceLibrary.js # Resource listing
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance + JWT interceptor
│   │   │   └── academicData.js    # Hardcoded curriculum data
│   │   └── App.js                 # Router + protected routes
│   └── public/
│
├── docker-compose.yml
└── plan.md                        # This file
```

---

## Database Schema

### Tables & Relationships

```
students ──< drive_applications >── drives ──< drive_eligible_departments
   │                                   │
   └──< todos                          └── postedBy → faculty

materials ──< material_units
   └── uploadedBy → faculty
```

| Table | Key Columns |
|-------|------------|
| **students** | id, rollNumber, collegeEmail, password, department, year, cgpa, backlogs, resumePath, profilePicPath, profileCompleted |
| **faculty** | id, facultyId, collegeEmail, password, name, department |
| **drives** | id, companyName, role, driveLink, minCGPA, maxBacklogs, package, expiryDate, postedBy(FK) |
| **drive_eligible_departments** | id, driveId(FK), department |
| **drive_applications** | id, studentId(FK), driveId(FK), status(interested/applied) — unique(studentId, driveId) |
| **materials** | id, regulation, semester, subject, department, syllabusLink, uploadedBy(FK) |
| **material_units** | id, materialId(FK), name, link |
| **todos** | id, studentId(FK), task, isCompleted, deadline |

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Description |
|--------|------|-------------|
| POST | /student/register | Register student |
| POST | /student/login | Login student |
| POST | /faculty/register | Register faculty |
| POST | /faculty/login | Login faculty |

### Drives (`/api/drives`)
| Method | Path | Description |
|--------|------|-------------|
| POST | / | Create drive (Faculty) |
| GET | /faculty | Get faculty's drives |
| GET | /student | Get active drives + eligibility for student |
| PUT | /:id | Update drive (Faculty) |
| DELETE | /:id | Delete drive (Faculty) |
| POST | /apply/:driveId | Apply to drive (Student) |
| PATCH | /apply/:driveId | Update application status |

### Student (`/api/student`)
| Method | Path | Description |
|--------|------|-------------|
| GET | /profile | Get profile |
| PUT | /profile | Update profile (name, cgpa, backlogs, section) |
| POST | /profile/resume | Upload resume (pdf/doc/docx, 5MB max) |
| DELETE | /profile/resume | Delete resume |
| POST | /profile/picture | Upload profile pic (jpg/png/webp, 2MB max) |
| DELETE | /profile/picture | Delete profile pic |

### Todos (`/api/todos`)
| Method | Path | Description |
|--------|------|-------------|
| GET | / | List all todos |
| POST | / | Create todo |
| PATCH | /:id/toggle | Toggle completion |
| DELETE | /:id | Delete todo |

### Other
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/dashboard | Role-specific dashboard data |
| GET | /api/health | Server health check |

---

## Authentication Flow

```
Client                          Server
  │                               │
  ├── POST /auth/student/login ──>│
  │   { rollNumber, password }    │── bcrypt.compare(password, hash)
  │                               │── jwt.sign({ id }, SECRET, { expiresIn: '7d' })
  │<── { token, user } ──────────│
  │                               │
  ├── Store token in localStorage │
  │                               │
  ├── GET /drives/student ───────>│
  │   Authorization: Bearer <jwt> │── authMiddleware verifies JWT
  │                               │── loads Student from DB
  │<── { drives } ───────────────│
```

- **Axios interceptor** auto-attaches `Authorization: Bearer <token>` header
- **Protected routes** in React check `AuthContext.user` before rendering

---

## Key Business Logic

### Drive Eligibility
1. Faculty creates drive with eligible departments + minCGPA + maxBacklogs
2. Student sees only drives matching their department
3. Eligibility check: `student.cgpa >= drive.minCGPA && student.backlogs <= drive.maxBacklogs`
4. Ineligible students see the drive but cannot apply

### Profile Completion
- Required fields: firstName, lastName, CGPA
- `profileCompleted` flag updates automatically on save
- Students must complete profile before applying to any drive

### Application Status
- Two states: `interested` → `applied`
- Unique constraint prevents duplicate applications
- Student can self-track their application status

### Email Notifications
- Welcome email on registration
- Drive notification to eligible students when new drive is posted
- Deadline reminders via cron job

---

## Frontend Routing

| Route | Component | Auth |
|-------|-----------|------|
| `/` | Home | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/student/dashboard` | StudentDashboard | Student |
| `/student/profile` | StudentProfile | Student |
| `/student/materials` | Materials | Student |
| `/student/todos` | TodoTracker | Student |
| `/student/attendance` | ResourcePage | Student |
| `/faculty/dashboard` | FacultyDashboard | Faculty |

---

## Mobile Responsive Design (Implemented)

All pages are mobile-friendly using MUI's built-in responsive system:

| Component | Mobile Behavior |
|-----------|----------------|
| **Navbar** | Hamburger icon + Drawer with nav items, logo shortens to "CPP" |
| **StudentDashboard** | Stats always visible, header stacks vertically, bento grid 2+1 layout |
| **ApplyDialog** | Goes fullscreen below 600px, buttons stack vertically |
| **StudentProfile** | Avatar + heading stack vertically, responsive card padding |
| **FacultyDashboard** | Dialog fullscreen below 600px, header stacks, link wraps |
| **TodoTracker** | HUD repositions from absolute to flow, responsive spacing |
| **Home** | Orbital section scales, CTA buttons stack on mobile |
| **ResourcePage** | Responsive padding, typography, and button sizing |

---

## Middleware Stack (Request Pipeline)

```
Request
  → CORS (restricted to FRONTEND_URL)
  → express.json (10MB limit)
  → Rate Limiter (auth routes: 20 req/15min)
  → Static files (/uploads)
  → Route handlers (auth → drives → student → todos → dashboard)
  → Global error handler
Response
```

---

## Supported Departments

CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML

**Regulations:** R20, R23
**Semesters:** 1-1 through 4-2

---

## Running the Project

### Local Development
```bash
# Backend
cd backend && npm install && npm run dev    # Starts on :5001

# Frontend
cd frontend && npm install && npm start     # Starts on :3000
```

### Docker
```bash
docker-compose up --build
```

### Environment Variables
Backend requires `.env` with: `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRE`, `FRONTEND_URL`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`
