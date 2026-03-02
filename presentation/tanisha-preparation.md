# Tanisha — Presentation Preparation

## Your Role: YOU PRESENT LAST (After Ajay) AND CLOSE THE PRESENTATION
**You present the Assignment System, Study Materials, Email Notifications, and wrap up with closing remarks.**

> Read this entire file carefully. Everything is explained from scratch.

---

## PART 1: Assignment System

### What Is This?
Faculty can create assignments and assign them to specific students. Students submit their work via Google Drive links. The system automatically detects if a submission is on-time or late.

### Faculty Side — Creating Assignments

**What faculty does:**
1. Clicks "Create Assignment" on the Faculty Assignments page
2. Fills in:
   - **Title** (e.g., "DBMS ER Diagram Assignment")
   - **Description** (detailed instructions)
   - **Deadline** (date + time, e.g., "March 10, 2026 11:59 PM")
   - **Assign to students** — faculty types a roll number → system searches and shows matching students → faculty selects them
3. Can assign to **multiple students at once** (they appear as chips/tags)
4. Clicks Create → assignment is saved → all assigned students get an **email notification**

**How student search works:**
- Faculty types "21B01A" in the search box
- Frontend sends `GET /api/assignments/students/search?q=21B01A`
- Backend searches the students table using `LIKE '%21B01A%'` (partial match)
- Returns up to 20 matching students with their name, roll number, department
- Faculty clicks to select → student appears as a chip

**After creation, faculty can:**
- See all their assignments in a card layout
- Each card shows: title, deadline, "X/Y Submitted" count
- Click to **view submissions** → sees a table with:
  - Students who submitted: name, roll number, Google Drive link, time, status (on-time/late)
  - Students who haven't submitted yet: name, roll number
- **Delete** assignments

### Student Side — Viewing & Submitting Assignments

**What students see:**
- A list of all assignments assigned to them
- Each card shows:
  - Title, description, faculty name
  - **Real-time countdown timer** that updates every second: "2d 5h 23m 12s remaining"
  - **Color-coded urgency**:
    - Green → more than 24 hours left
    - Amber/Yellow → less than 24 hours
    - Red → less than 2 hours left
    - Gray → expired (deadline passed)
  - Status chip: "Not Submitted" (gray) / "Submitted" (green) / "Late" (red)

**Submitting an assignment:**
1. Student clicks "Submit" on an assignment
2. A dialog opens with:
   - Google Drive link field — MUST contain `drive.google.com` (validated on both frontend and backend)
   - Optional comments text field
3. Student pastes their Google Drive link and clicks Submit
4. Backend checks:
   - Is the link valid? (must contain `drive.google.com`)
   - Is the current time before or after the deadline?
   - If BEFORE deadline → status = **"submitted"** (on-time)
   - If AFTER deadline → status = **"late"**
5. Submission is saved → **email is sent to the faculty** with student's name, roll number, drive link, and whether it was on-time or late

**Editing a submission:**
- Students can edit their submission (change the drive link or comments)
- BUT only **before the deadline** — after the deadline, editing is blocked
- Backend enforces this: `if (new Date() > assignment.deadline) return error`

### How the Countdown Timer Works:
```javascript
// In StudentAssignments.js, a setInterval runs every 1 second:
setInterval(() => {
    const now = new Date();
    const deadline = new Date(assignment.deadline);
    const diff = deadline - now; // milliseconds remaining

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    // Display: "2d 5h 23m 12s"
}, 1000);
```

### Database Schema:

```
assignments table
├── id (auto-increment)
├── title (string, max 200 chars)
├── description (text)
├── deadline (datetime)
├── facultyId (foreign key → faculty.id)
└── createdAt, updatedAt

assignment_students table (junction — links assignments to students)
├── assignmentId (foreign key → assignments.id, CASCADE delete)
├── studentId (foreign key → students.id)
└── Unique constraint: (assignmentId + studentId) — no duplicate assignments

submissions table
├── id (auto-increment)
├── assignmentId (foreign key → assignments.id)
├── studentId (foreign key → students.id)
├── driveLink (string — must be a Google Drive URL)
├── comments (text, optional)
├── submittedAt (datetime — when they submitted)
├── status ("submitted" or "late")
└── Unique constraint: (assignmentId + studentId) — one submission per student per assignment
```

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/models/Assignment.js` | Assignment model + AssignmentStudent junction model |
| `backend/models/Submission.js` | Submission model with drive link validation |
| `backend/controllers/assignmentController.js` | All the logic — create, list, submit, view submissions, delete |
| `backend/routes/assignmentRoutes.js` | API endpoint definitions |
| `frontend/src/pages/FacultyAssignments.js` | Faculty assignment management page |
| `frontend/src/pages/StudentAssignments.js` | Student assignment viewing + submission page |

### API Endpoints:

**Faculty (require faculty JWT):**
```
POST   /api/assignments                → Create assignment + assign to students
GET    /api/assignments/faculty        → Get all my assignments
GET    /api/assignments/students/search?q=21B → Search students by roll number
GET    /api/assignments/:id/submissions → View who submitted and who didn't
DELETE /api/assignments/:id            → Delete an assignment
```

**Student (require student JWT):**
```
GET    /api/assignments/student        → Get assignments assigned to me
POST   /api/assignments/:id/submit    → Submit (drive link + comments)
PUT    /api/assignments/:id/submit    → Update my submission (only before deadline)
```

### Demo Steps:
1. Login as faculty
2. Go to "Assignments" tab in navbar
3. Click "Create Assignment"
4. Type a title: "DBMS ER Diagram"
5. Add description: "Draw an ER diagram for a library management system"
6. Set deadline to a few minutes from now (so you can demo the countdown)
7. Search for a student by roll number → select them
8. Click Create → show it appears in the list
9. Login as student
10. Go to "Assignments" → show the countdown timer ticking
11. Click Submit → paste any Google Drive link (e.g., `https://drive.google.com/file/d/example`)
12. Show the status changes to "Submitted"
13. Go back to faculty → click the assignment → show the submission in the table

---

## PART 2: Study Materials

### What Is This?
A library of **230+ study resources** organized by regulation, semester, and subject. Students can browse and access study material PDFs directly via Google Drive links.

### How It's Organized:
```
Regulation (R20 or R23)
    └── Semester (1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2)
        └── Subject (e.g., DBMS, OS, CN, etc.)
            └── Units (Unit 1, Unit 2, ... Unit 5)
                └── Each unit has a Google Drive PDF link
            └── Optional: Syllabus PDF link
```

### How Students Use It:
1. Go to "Materials" page from navbar
2. Select **Regulation** → dropdown shows R20, R23
3. Select **Semester** → dropdown auto-populates based on available data
4. Select **Subject** → dropdown shows subjects for that semester
5. Material units appear in a list → each has an "Access" button
6. Click "Access" → opens the Google Drive PDF in a new tab
7. If a syllabus is available → "Download PDF" button appears in the sidebar

### How It Works (Backend):
1. Frontend sends: `GET /api/drives/materials/filter?regulation=R20`
2. Backend queries the `materials` table + joins `material_units` table
3. Returns all materials for that regulation with their units
4. Frontend derives available semesters and subjects from the response
5. When student selects a subject → matching material is filtered on the frontend

### Database Schema:
```
materials table
├── id
├── regulation ("R20" or "R23")
├── semester ("1-1", "1-2", ..., "4-2")
├── subject (e.g., "DBMS", "Operating Systems")
├── department (optional)
├── syllabusLink (Google Drive PDF link, optional)
└── createdAt, updatedAt

material_units table
├── id
├── materialId (foreign key → materials.id)
├── name ("Unit 1", "Unit 2", etc.)
└── link (Google Drive PDF link)
```

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/models/Material.js` | Material + MaterialUnit models |
| `backend/controllers/materialController.js` | `getMaterialsByFilter()` — filters materials |
| `backend/seedMaterials.js` | Script with all 230+ material entries — run once to populate DB |
| `frontend/src/pages/Materials.js` | Materials browser page UI |

### Demo Steps:
1. Login as student → go to "Materials"
2. Select Regulation: R23
3. Select Semester: 1-1
4. Select Subject: (pick any available one)
5. Show the units list with "Access" buttons
6. Click one → show it opens a Google Drive PDF
7. Say: "We have 230+ resources covering 49 subjects across both R20 and R23 regulations, all organized and accessible in one place"

---

## PART 3: Email Notification System

### What Is This?
The app automatically sends emails for important events. Nobody has to manually send anything — it all happens in the background.

### All Email Types:

| # | When It Triggers | Who Gets It | What It Says |
|---|-----------------|-------------|-------------|
| 1 | Student registers | The student | Welcome email with platform overview and features |
| 2 | Faculty registers | The faculty | Welcome email with capabilities |
| 3 | Faculty creates a new drive | All students in eligible departments | Company name, role, package, deadline, link to apply |
| 4 | Faculty updates a drive | Students in eligible departments | What changed (e.g., "Package updated from 8 LPA to 10 LPA") |
| 5 | Faculty assigns an assignment | All assigned students | Assignment title, deadline, faculty name |
| 6 | Student submits an assignment | The faculty who created it | Student name, roll number, drive link, on-time/late status |
| 7 | Drive deadline is today (8 AM daily) | Students who haven't applied | Reminder: "Drive for [Company] expires today!" |

### How Emails Are Sent:
- We use **Nodemailer** library with **Gmail SMTP**
- Emails use **HTML templates** — they look professional with colors, headers, and buttons
- Emails are sent in **batches of 10** to avoid being blocked by Gmail
- All emails are **fire-and-forget** — if email fails, the main operation still succeeds
- The daily deadline reminder runs as a **cron job** at 8 AM using `node-cron`

### Key File:
| File | What It Does |
|------|-------------|
| `backend/utils/emailService.js` | Contains all email templates + `sendEmail()`, `sendSubmissionNotification()`, `notifyAssignmentAssigned()`, `startDeadlineReminderCron()` |

### What to Say in Presentation:
> "Our platform sends 7 types of automated emails. When a faculty posts a new drive, all eligible students get an email. When a student submits an assignment, the faculty gets notified. There's also a daily cron job that runs at 8 AM to remind students about drives expiring that day. All emails use professional HTML templates and are sent in batches to avoid spam detection."

---

## PART 4: Closing the Presentation

### Wrap Up — Say This:

> "To summarize what we've built: **Campus Placement Portal** is a full-stack platform that brings together placement drive management, assignment submission, study material access, and personal task tracking — all in one place."

> "Some key highlights:"
> - "11 frontend pages, 20+ API endpoints, 8 database models"
> - "Smart eligibility checking for placement drives based on CGPA, backlogs, and department"
> - "Real-time deadline countdown for assignments with automatic late detection"
> - "230+ study resources across R20 and R23 regulations"
> - "7 types of automated email notifications"
> - "Role-based access control — students and faculty have completely separate dashboards and permissions"

> "The tech stack is React.js and Material UI on the frontend, Node.js with Express on the backend, SQL Server with Sequelize ORM for the database, JWT for authentication, and Nodemailer for email notifications."

> "Thank you. We're happy to take any questions."

---

## Questions You Might Get Asked

| Question | Your Answer |
|----------|-------------|
| "Why Google Drive links for submissions?" | It avoids file storage costs on our server. Students are already familiar with Google Drive. We validate that the URL contains `drive.google.com` to ensure it's a real Drive link. |
| "Can a student submit twice?" | No. We have a unique constraint on (assignmentId + studentId). If they submit again, it updates their existing submission instead of creating a duplicate. |
| "What if a student submits after the deadline?" | The system accepts it but marks it as "late". The status field is set to "late" and the faculty can see this clearly in their submissions table. |
| "Can students edit their submission after deadline?" | No. The backend checks `if (new Date() > assignment.deadline)` and returns an error. |
| "How are materials populated?" | We have a seed script (`seedMaterials.js`) that inserts all 230+ material entries into the database. It runs once during setup. The materials are organized by regulation, semester, and subject with Google Drive links for each unit. |
| "What is a cron job?" | It's a scheduled task that runs automatically at a specific time. Our cron job runs every day at 8 AM to check for drives expiring today and sends reminder emails to students who haven't applied yet. |
| "How does batch email sending work?" | We send emails in groups of 10 at a time instead of all at once. This prevents Gmail from blocking us for sending too many emails too fast. |
| "What is an ORM?" | ORM stands for Object-Relational Mapping. Sequelize is our ORM — it lets us interact with the SQL database using JavaScript objects and methods instead of writing raw SQL queries. For example, `Assignment.findAll()` generates a SELECT query automatically. |
| "What is a foreign key?" | It's a column in one table that references the primary key of another table. For example, `submissions.studentId` references `students.id`. This creates a relationship between the two tables and ensures data integrity. |
| "How do you handle errors?" | We have a global error handler middleware in Express. If any API fails, the error is caught, logged, and a clean error message is sent back to the frontend. Sensitive error details are hidden in production. |

---

**Your total time: ~7-8 minutes + Q&A. You close the presentation.**
