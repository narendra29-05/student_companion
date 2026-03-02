# Tanisha - Presentation Preparation

## Role: Assignments + Study Materials + Email Notifications

---

## Your Responsibilities

### 1. Assignment System (Faculty Side)
**What to explain:**
- Faculty creates assignments with:
  - Title and description
  - Deadline (date + time)
  - Assign to specific students by searching roll numbers
- Student search: Type roll number → autocomplete shows matching students (name, department, year)
- Faculty can assign to multiple students at once (chip-based selection)
- After creation, faculty sees:
  - List of all their assignments
  - Submission count per assignment (e.g., "5/12 Submitted")
  - View submissions: who submitted, who didn't, drive links, on-time vs late
- Faculty can delete assignments

### 2. Assignment System (Student Side)
**What to explain:**
- Students see all assignments assigned to them
- Each assignment card shows:
  - Title, description, faculty name
  - **Real-time countdown timer** (days, hours, minutes, seconds)
  - Urgency color coding:
    - Green → plenty of time
    - Amber/Yellow → less than 24 hours
    - Red → less than 2 hours
    - Gray → expired
- Submit via **Google Drive link** (validates `drive.google.com` URL)
- Optional comments with submission
- Can edit submission ONLY before deadline
- Status tracking: Not Submitted → Submitted → Late

### 3. Study Materials System
**What to explain:**
- 230+ study resources organized by:
  - **Regulation**: R20 and R23
  - **Semester**: 1-1 through 4-2
  - **Subject**: All subjects for selected semester
- Material structure:
  - Each subject has multiple **units** (chapters)
  - Each unit has a **name** and **access link** (Google Drive PDF)
  - Optional **syllabus link** per subject
- Filter flow: Select Regulation → Semester auto-populates → Select Subject → View units
- Materials stored in database (seeded by admin)

### 4. Email Notification System
**What to explain:**
- The platform sends automated emails for:

| Event | Who Gets Email | What It Contains |
|-------|---------------|-----------------|
| Student registers | Student | Welcome email with feature overview |
| Faculty registers | Faculty | Welcome email with capabilities |
| New drive posted | All eligible students | Company, role, package, deadline, apply link |
| Drive updated | Affected students | What changed (highlighted), updated details |
| Assignment assigned | Assigned students | Title, deadline, faculty name |
| Assignment submitted | Faculty | Student name, roll number, drive link, on-time/late |
| Drive deadline (daily) | Students who haven't applied | Reminder for drives expiring today |

- Uses Nodemailer with HTML templates
- Batch sending: 10 emails at a time (prevents spam blocking)
- Cron job runs daily at 8 AM for deadline reminders

---

## Key Files to Know

| File | What It Does |
|------|-------------|
| `backend/models/Assignment.js` | Assignment + AssignmentStudent junction models |
| `backend/models/Submission.js` | Submission model (driveLink, status, comments) |
| `backend/controllers/assignmentController.js` | All assignment CRUD + submission logic |
| `backend/routes/assignmentRoutes.js` | Assignment API endpoints |
| `backend/models/Material.js` | Material + MaterialUnit models |
| `backend/controllers/materialController.js` | Material filter/fetch logic |
| `backend/utils/emailService.js` | All email templates + send functions |
| `frontend/src/pages/FacultyAssignments.js` | Faculty assignment management UI |
| `frontend/src/pages/StudentAssignments.js` | Student assignment view + submit UI |
| `frontend/src/pages/Materials.js` | Study materials browsing page |

---

## API Endpoints to Know

### Assignment Endpoints:
```
Faculty (require faculty JWT):
POST   /api/assignments              → Create assignment
GET    /api/assignments/faculty      → Get my assignments
GET    /api/assignments/students/search?q=  → Search students
GET    /api/assignments/:id/submissions     → View submissions
DELETE /api/assignments/:id          → Delete assignment

Student (require student JWT):
GET    /api/assignments/student      → Get my assignments
POST   /api/assignments/:id/submit  → Submit assignment
PUT    /api/assignments/:id/submit  → Update submission
```

### Material Endpoints:
```
GET    /api/drives/materials/filter?regulation=R20  → Get materials by filter
```

---

## Database Schema to Explain

```
Assignment Table
├── id, title, description, deadline
├── facultyId (FK → Faculty)
└── timestamps

AssignmentStudent (Junction)
├── assignmentId (FK → Assignment, CASCADE delete)
├── studentId (FK → Student)
└── Unique: (assignmentId + studentId)

Submission Table
├── assignmentId (FK → Assignment)
├── studentId (FK → Student)
├── driveLink (Google Drive URL, validated)
├── comments (optional)
├── submittedAt, status (submitted | late)
└── Unique: (assignmentId + studentId)

Material Table
├── id, regulation (R20/R23), semester
├── subject, department, syllabusLink
└── timestamps

MaterialUnit Table
├── materialId (FK → Material)
├── name (unit/chapter name)
└── link (Google Drive PDF link)
```

---

## How Late Detection Works (Important!)

```
Student submits assignment:
1. Get assignment deadline from DB
2. Compare: current time vs deadline
3. If current > deadline → status = 'late'
   If current <= deadline → status = 'submitted'
4. Save submission with status
5. Fire-and-forget email to faculty with status info
```

**Edit rules:**
- Can edit submission only BEFORE deadline
- After deadline: edit blocked, returns error

---

## Questions You Might Get Asked

1. **Why Google Drive links only?**
   → Avoids file storage costs. Students are familiar with Drive. URL validated to contain `drive.google.com`.

2. **Can a student submit twice?**
   → No. Unique constraint on (assignmentId + studentId). Second submit updates the existing one.

3. **How does the countdown timer work?**
   → `setInterval` running every second on the frontend. Calculates days/hours/minutes/seconds from deadline.

4. **How are materials organized?**
   → Regulation → Semester → Subject → Units. All stored in DB, fetched via API filter endpoint.

5. **What if email sending fails?**
   → Fire-and-forget pattern. Email errors are logged but don't block the main operation (assignment creation, submission, etc.)

---

## Demo Points (For Live Demo)
1. Faculty: Create an assignment → search and select students → set deadline
2. Student: View assigned assignments → show countdown timer
3. Student: Submit with Google Drive link → show success
4. Faculty: View submissions → show who submitted vs who didn't
5. Show Materials page → select R20 → semester → subject → access units
6. (Optional) Show email template in backend logs
