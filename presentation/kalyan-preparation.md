# Kalyan - Presentation Preparation

## Role: Authentication + Student Profile + To-Do Tracker + Attendance

---

## Your Responsibilities

### 1. Authentication System (Login & Register)
**What to explain:**
- **Dual-role system**: Student and Faculty have separate registration & login
- **Student registration** requires:
  - Roll number (auto-uppercased, unique)
  - College email (unique)
  - Full name
  - Department (CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML)
  - Year (1-4)
  - Password (bcrypt hashed before storing)
- **Faculty registration** requires:
  - Faculty ID (unique)
  - College email (unique)
  - Name, department, password
- **Login flow:**
  1. User enters credentials
  2. Backend verifies password with bcrypt
  3. JWT token generated (expires in 7 days)
  4. Token stored in localStorage
  5. Axios interceptor attaches token to every API request
  6. Role-based redirect: student → `/student/dashboard`, faculty → `/faculty/dashboard`
- **Security features:**
  - Rate limiting: 20 login attempts per 15 minutes
  - Passwords never stored in plain text
  - JWT includes user ID + role
  - Middleware guards: `protectStudent()` and `protectFaculty()`

### 2. Student Profile System
**What to explain:**
- Students can update their profile:
  - First name, last name
  - CGPA (0-10 scale) — **critical for drive eligibility**
  - Number of backlogs — **critical for drive eligibility**
  - Section
- **Resume management:**
  - Upload resume (PDF/DOC files)
  - View/download uploaded resume
  - Delete and re-upload
  - Stored in `backend/uploads/resumes/`
- **Profile picture:**
  - Upload profile photo
  - Shows in Navbar avatar
  - Delete and re-upload
  - Stored in `backend/uploads/profile-pics/`
- **Profile completion:**
  - `profileCompleted` flag set when all required fields are filled
  - Must be completed before applying to drives
  - Indicator shown on profile page

### 3. To-Do Tracker
**What to explain:**
- Personal task management for students
- Features:
  - Add tasks with optional deadlines
  - Mark tasks as complete/incomplete (toggle)
  - Delete tasks
  - Deadline tracking with urgency colors:
    - Red → overdue
    - Amber → due soon
    - Green → plenty of time
  - Task completion statistics (X/Y completed)
  - Overdue task highlighting
- Has its own dark/light mode toggle
- Data stored per-student (each student sees only their tasks)

### 4. Attendance Portal
**What to explain:**
- Quick access to semester-wise attendance tracking
- Percentage monitoring
- Helps students stay above minimum attendance requirement
- Integrated into student navigation

---

## Key Files to Know

| File | What It Does |
|------|-------------|
| `backend/controllers/authController.js` | Register + Login logic for both roles |
| `backend/middleware/authMiddleware.js` | JWT verification middleware |
| `backend/models/Student.js` | Student model with bcrypt hooks |
| `backend/models/Faculty.js` | Faculty model with bcrypt hooks |
| `backend/controllers/studentController.js` | Profile CRUD + file uploads |
| `backend/routes/studentRoutes.js` | Profile API endpoints |
| `backend/middleware/upload.js` | Multer file upload configuration |
| `backend/models/Todo.js` | Todo model |
| `backend/controllers/todoController.js` | Todo CRUD operations |
| `frontend/src/pages/Login.js` | Login page UI |
| `frontend/src/pages/Register.js` | Registration page UI |
| `frontend/src/pages/StudentProfile.js` | Profile management UI |
| `frontend/src/pages/TodoTracker.js` | Task tracker UI |
| `frontend/src/context/AuthContext.js` | Global auth state (JWT, user, role) |

---

## API Endpoints to Know

### Auth Endpoints:
```
POST   /api/auth/student/register  → Register student
POST   /api/auth/student/login     → Student login (returns JWT)
POST   /api/auth/faculty/register  → Register faculty
POST   /api/auth/faculty/login     → Faculty login (returns JWT)
```

### Profile Endpoints (require student JWT):
```
GET    /api/student/profile           → Get my profile
PUT    /api/student/profile           → Update profile details
POST   /api/student/profile/resume    → Upload resume
DELETE /api/student/profile/resume    → Delete resume
POST   /api/student/profile/picture   → Upload profile picture
DELETE /api/student/profile/picture   → Delete profile picture
```

### Todo Endpoints (require student JWT):
```
GET    /api/todos          → Get my todos
POST   /api/todos          → Create new todo
PATCH  /api/todos/:id/toggle  → Toggle complete/incomplete
DELETE /api/todos/:id      → Delete todo
```

---

## Database Schema to Explain

```
Student Table
├── id, rollNumber (unique), collegeEmail (unique)
├── password (bcrypt hashed)
├── name, firstName, lastName
├── department, year, section
├── cgpa (0-10), backlogs (default: 0)
├── resumePath, profilePicPath
├── profileCompleted (boolean)
└── timestamps

Faculty Table
├── id, facultyId (unique), collegeEmail (unique)
├── password (bcrypt hashed)
├── name, department
└── timestamps

Todo Table
├── id, studentId (FK → Student)
├── task (max 500 chars)
├── isCompleted (boolean, default: false)
├── deadline (optional)
└── timestamps
```

---

## How JWT Authentication Works (Important!)

```
Registration:
1. Validate input → Hash password with bcrypt
2. Create user in DB → Generate JWT with (id, role)
3. Return token + user data

Login:
1. Find user by email/rollNumber
2. Compare password with bcrypt
3. Generate JWT → Return token + user data

Every API Request:
1. Axios interceptor adds: Authorization: Bearer <token>
2. Middleware decodes JWT → Finds user in DB
3. Attaches user to req.student or req.faculty
4. If token invalid/expired → 401 Unauthorized
```

---

## How Profile Completion Works

```
Student updates profile:
1. Backend receives: firstName, lastName, cgpa, backlogs, section
2. If ALL fields are present → profileCompleted = true
3. Save to database
4. Profile completion is REQUIRED to apply to placement drives
```

---

## Questions You Might Get Asked

1. **Why JWT instead of sessions?**
   → Stateless auth. No server-side storage needed. Token contains all info. Works well with REST APIs.

2. **What happens when token expires?**
   → User gets 401 error. Frontend AuthContext catches it and redirects to login page.

3. **How are passwords stored?**
   → bcrypt with salt rounds. Even if DB is breached, passwords can't be reversed.

4. **Can faculty see student todos?**
   → No. `protectStudent` middleware ensures only the logged-in student can access their own todos.

5. **Where are files stored?**
   → `backend/uploads/resumes/` and `backend/uploads/profile-pics/`. Multer handles file type validation and naming.

6. **How is rate limiting implemented?**
   → `express-rate-limit` middleware on auth routes. 20 requests per 15-minute window per IP.

---

## Demo Points (For Live Demo)
1. Register a new student account → show form validation
2. Login with the account → show JWT token in DevTools (localStorage)
3. Go to Profile → update CGPA and backlogs → upload resume
4. Go to To-Do Tracker → add tasks with deadlines
5. Mark tasks complete → show statistics update
6. Show how profile completion affects drive eligibility (hand over to Ajay)
