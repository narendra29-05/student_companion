# Narendra Kosireddy - Presentation Preparation

## Role: Project Lead + Architecture + UI/UX

---

## Your Responsibilities

### 1. Project Introduction (Opening)
- What is Campus Placement Portal (CPP)?
- Problem statement: Students miss placement drives, lack organized materials, no central system
- Solution: Unified platform for placements, assignments, materials, and task tracking
- Who is it for? Students + Faculty (dual-role system)

### 2. Architecture Overview
**Explain the full-stack architecture:**
- Frontend: React.js SPA with Material UI components
- Backend: Node.js + Express REST API
- Database: SQL Server with Sequelize ORM
- Authentication: JWT tokens (7-day expiry) with bcrypt password hashing
- File Storage: Multer for resume/profile picture uploads
- Email: Nodemailer with HTML templates + cron jobs

**Draw/show this flow:**
```
React App (Port 3000)
    ↓ Axios API calls
Express Server (Port 5001)
    ↓ Sequelize queries
SQL Server Database
    ↓
8 Models + 3 Junction Tables
```

### 3. Home Page & Navbar (Your code)
- Animated landing page with Framer Motion
- Dark/Light mode toggle
- Glassmorphism Navbar with animated nav pills
- Zigzag feature showcase
- Comparison bar graphs (Student vs Faculty benefits)
- Animated stat counters & circular progress rings
- Responsive design (mobile drawer + desktop pills)

### 4. Project Structure
```
student_companion/
├── backend/
│   ├── config/         → DB connection, constants
│   ├── controllers/    → Business logic (6 controllers)
│   ├── middleware/      → Auth guards, file upload, error handler
│   ├── models/         → 8 Sequelize models
│   ├── routes/         → 5 route files
│   ├── utils/          → Email service
│   └── server.js       → Express entry point
├── frontend/
│   ├── src/pages/      → 11 page components
│   ├── src/components/ → Navbar, ApplyDialog
│   ├── src/context/    → AuthContext (global state)
│   └── src/services/   → Axios API instance
```

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Express setup, middleware, route mounting |
| `backend/models/index.js` | All model associations |
| `frontend/src/App.js` | React Router, route definitions |
| `frontend/src/context/AuthContext.js` | JWT storage, login/logout, role management |
| `frontend/src/pages/Home.js` | Landing page with all animations |
| `frontend/src/components/Navbar.js` | Glassmorphism navbar with animated pills |

---

## Questions You Might Get Asked

1. **Why SQL Server instead of MongoDB?**
   → Relational data (students-assignments-submissions) needs proper foreign keys and joins. Sequelize ORM makes it easy.

2. **How does authentication work?**
   → JWT token generated on login, stored in localStorage, sent in Authorization header via Axios interceptor.

3. **How is the app deployed?**
   → Docker Compose available for containerized deployment. Frontend build served separately.

4. **How do you handle role-based access?**
   → Separate middleware: `protectStudent()` and `protectFaculty()` verify JWT and attach user to request.

---

## Demo Points (For Live Demo)
1. Show the Home page animations (scroll through sections)
2. Toggle dark/light mode
3. Show responsive navbar (resize browser)
4. Hand over to Kalyan for registration/login demo
