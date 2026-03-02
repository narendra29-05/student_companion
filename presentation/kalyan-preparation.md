# Kalyan — Presentation Preparation

## Your Role: YOU START THE PRESENTATION
**You introduce the project, explain the tech stack, and present the Authentication System + Student Profile + To-Do Tracker**

> Read this entire file carefully. Everything is explained from scratch.

---

## PART 1: Project Introduction (You open the presentation)

### What to Say (Script):

> "Good morning everyone. We are presenting **Campus Placement Portal**, a full-stack web application designed to solve common problems faced by students and faculty in engineering colleges."

> "Today, students miss placement drive announcements because there's no central system. Study materials are scattered across WhatsApp groups. Faculty has no digital way to assign work and track submissions. Our platform solves all of this."

### Show the Home Page
- Open `http://localhost:3000` in browser
- Scroll through the home page slowly — it has animations
- Point out: Feature cards, comparison graphs, stat counters, the "For Students" and "For Faculty" sections
- Show the dark/light mode toggle (sun/moon icon on the right)

### Explain the Tech Stack (Keep it brief):

> "We built this using **React.js** for the frontend with **Material UI** for components and **Framer Motion** for animations. The backend runs on **Node.js with Express.js**. We use **SQL Server** as our database with **Sequelize ORM**. Authentication uses **JWT tokens** with **bcrypt** password hashing. We also have automated **email notifications** using Nodemailer."

### Show the Architecture:
> "The frontend makes API calls to the backend using Axios. The backend processes the request, talks to the SQL Server database using Sequelize, and returns the data. JWT tokens handle authentication — once you log in, you get a token that's sent with every request."

```
React (Port 3000) → Axios → Express API (Port 5001) → Sequelize → SQL Server
```

---

## PART 2: Authentication System (Login & Register)

### What Is This?
The app has **two types of users**: Students and Faculty. Each has separate registration and login. When a user logs in, the server creates a **JWT token** (a long encrypted string) that proves who they are. This token is stored in the browser and sent with every API request.

### How Registration Works (Step by Step):

**Student Registration** — requires:
- Roll Number (e.g., "21B01A0501") — must be unique, auto-converted to uppercase
- College Email — must be unique
- Full Name
- Department — one of: CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML
- Year — 1 to 4
- Password — gets **hashed** using bcrypt before storing (never saved as plain text)

**Faculty Registration** — requires:
- Faculty ID (unique)
- College Email (unique)
- Name, Department, Password

### How Login Works (Step by Step):

1. User enters their email/roll number and password
2. Backend finds the user in the database
3. Compares the entered password with the stored **bcrypt hash** using `bcrypt.compare()`
4. If match → creates a **JWT token** containing the user's ID and role
5. Token is sent back to the frontend
6. Frontend stores it in `localStorage`
7. **Every future API request** includes this token in the header: `Authorization: Bearer <token>`
8. Backend middleware (`protectStudent` or `protectFaculty`) verifies the token on each request
9. If token is expired or invalid → user gets logged out

### Security Features:
- **bcrypt**: Passwords are hashed with a salt. Even if someone hacks the database, they can't see the actual passwords
- **JWT expiry**: Tokens expire after 7 days — user must log in again
- **Rate limiting**: Only 20 login attempts per 15 minutes per IP address (prevents brute-force attacks)
- **Role-based middleware**: Student API endpoints check for student token, faculty endpoints check for faculty token. A student can't access faculty routes and vice versa.

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/controllers/authController.js` | Contains `registerStudent()`, `loginStudent()`, `registerFaculty()`, `loginFaculty()` functions |
| `backend/middleware/authMiddleware.js` | Contains `protectStudent()` and `protectFaculty()` — verifies JWT tokens |
| `backend/models/Student.js` | Student database table — has a `beforeCreate` hook that auto-hashes the password |
| `backend/models/Faculty.js` | Faculty database table — same password hashing |
| `frontend/src/context/AuthContext.js` | Stores the logged-in user, token, and role globally. Provides `login()` and `logout()` functions |
| `frontend/src/pages/Login.js` | Login page UI — has tabs for Student/Faculty |
| `frontend/src/pages/Register.js` | Registration page UI |

### API Endpoints:
```
POST /api/auth/student/register  → Create new student account
POST /api/auth/student/login     → Login as student → returns JWT token
POST /api/auth/faculty/register  → Create new faculty account
POST /api/auth/faculty/login     → Login as faculty → returns JWT token
```

### Demo Steps:
1. Open `http://localhost:3000/register`
2. Register a new student — fill all fields
3. Show that it redirects to dashboard after successful registration
4. Log out (click avatar → Logout)
5. Login with the same credentials at `/login`
6. Show "Welcome back" and redirect to student dashboard

---

## PART 3: Student Profile System

### What Is This?
After registration, students have a profile page where they can:
- Update personal details (first name, last name, section)
- Set their **CGPA** and **backlogs count** — THIS IS CRITICAL because placement drives check these for eligibility
- Upload a **resume** (PDF/DOC file)
- Upload a **profile picture** (shows in the navbar avatar)

### How It Works:

**Profile Update:**
1. Student goes to `/student/profile`
2. Edits fields: First Name, Last Name, CGPA (0-10), Backlogs (number), Section
3. Clicks Save → backend updates the database
4. If ALL required fields are filled → `profileCompleted` flag becomes `true`
5. **Profile must be completed before applying to any placement drive** — this is enforced

**Resume Upload:**
1. Student selects a PDF/DOC file
2. File is sent to backend via `POST /api/student/profile/resume`
3. **Multer** middleware saves the file to `backend/uploads/resumes/` folder
4. File path is stored in the Student database record
5. Student can delete and re-upload

**Profile Picture:**
1. Same flow as resume — uploaded via Multer
2. Saved to `backend/uploads/profile-pics/`
3. The navbar shows this image in the avatar circle (top-right)
4. If no picture → shows the first letter of the student's name

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/controllers/studentController.js` | `getProfile()`, `updateProfile()`, `uploadResume()`, `deleteResume()`, `uploadProfilePic()`, `deleteProfilePic()` |
| `backend/middleware/upload.js` | Multer configuration — sets file size limits, allowed file types, storage paths |
| `frontend/src/pages/StudentProfile.js` | Profile page UI with form fields, file upload buttons |

### API Endpoints:
```
GET    /api/student/profile          → Get my profile data
PUT    /api/student/profile          → Update CGPA, backlogs, name, section
POST   /api/student/profile/resume   → Upload resume file
DELETE /api/student/profile/resume   → Delete resume
POST   /api/student/profile/picture  → Upload profile photo
DELETE /api/student/profile/picture  → Delete photo
```

### Demo Steps:
1. After login, click avatar (top-right) → "My Profile"
2. Fill in: First Name, Last Name, CGPA = 8.5, Backlogs = 0, Section = A
3. Click Save → show success message
4. Upload a resume file (any PDF)
5. Show the resume appears with download link
6. Upload a profile picture → show it updates in the navbar avatar
7. Say: "Profile completion is required before applying to drives — Ajay will show that next"

---

## PART 4: To-Do Tracker

### What Is This?
A personal task manager for students. Each student has their own private to-do list — no one else can see it.

### Features:
- **Add tasks** with an optional deadline date
- **Mark complete/incomplete** — toggle checkbox
- **Delete tasks**
- **Deadline urgency** — tasks change color based on deadline:
  - Red → overdue (past deadline)
  - Amber/Yellow → due soon
  - Green → plenty of time
  - No color → no deadline set
- **Statistics** — shows "X out of Y tasks completed"
- **Dark/Light mode** — has its own theme toggle

### How It Works:
1. Student types a task name (e.g., "Complete DBMS assignment")
2. Optionally picks a deadline date
3. Clicks Add → task appears in the list
4. Can click the checkbox to mark complete → counter updates
5. Can delete tasks they no longer need
6. Each student's tasks are separate — stored with their `studentId` in the database

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/models/Todo.js` | Todo database table — id, studentId, task, isCompleted, deadline |
| `backend/controllers/todoController.js` | `getTodos()`, `addTodo()`, `toggleTodo()`, `deleteTodo()` |
| `frontend/src/pages/TodoTracker.js` | To-do page UI |

### API Endpoints:
```
GET    /api/todos             → Get all my todos
POST   /api/todos             → Create new todo
PATCH  /api/todos/:id/toggle  → Toggle complete/incomplete
DELETE /api/todos/:id         → Delete a todo
```

### Demo Steps:
1. Navigate to "To-Do" in the navbar
2. Add a task: "Prepare for interview" with tomorrow's deadline
3. Add another: "Submit lab report" with no deadline
4. Mark one as complete → show the counter update
5. Point out the deadline color coding
6. Say: "This helps students stay organized alongside their placement and academic activities"

---

## PART 5: Hand Over to Ajay

After your demo, say:

> "Now that we've seen how students register, set up their profile, and manage their tasks — Ajay will show you the core feature of our platform: **Placement Drives**. He'll demonstrate how faculty creates drives and how students can browse and apply to them."

---

## Questions You Might Get Asked

| Question | Your Answer |
|----------|-------------|
| "Why JWT instead of sessions?" | JWT is stateless — no server-side storage needed. The token contains all the info. Works perfectly with REST APIs and can scale horizontally. |
| "How are passwords stored?" | Using bcrypt with salt rounds. Even if the database is breached, passwords can't be reversed — they're one-way hashes. |
| "Can a student access faculty routes?" | No. We have separate middleware — `protectStudent()` and `protectFaculty()`. The JWT token contains the user's role, and the middleware checks it. |
| "What if the token expires?" | User gets a 401 Unauthorized error. The frontend catches this and redirects to the login page automatically. |
| "Where are uploaded files stored?" | In the `backend/uploads/` folder — resumes in `/resumes/` and profile pics in `/profile-pics/`. Multer handles the file saving. |
| "What is Sequelize?" | It's an ORM — Object Relational Mapping. Instead of writing raw SQL queries, we write JavaScript. For example, `Student.findAll()` generates `SELECT * FROM students` automatically. |

---

**Your total time: ~7-8 minutes. Then hand over to Ajay.**
