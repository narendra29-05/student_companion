# Ajay — Presentation Preparation

## Your Role: YOU PRESENT SECOND (After Kalyan)
**You present the Placement Drives system — how faculty creates drives and how students browse and apply.**

> Read this entire file carefully. Everything is explained from scratch.

---

## What Are Placement Drives?

Companies visit colleges to recruit students — these are called **placement drives**. In our system:
- **Faculty** posts drive details (company name, role, salary package, eligibility criteria)
- **Students** browse available drives, check if they're eligible, and apply

This is the **core feature** of the entire platform.

---

## PART 1: Faculty Dashboard — Creating & Managing Drives

### What Faculty Can Do:
1. **Create** a new placement drive
2. **Edit** an existing drive (update details)
3. **Delete** a drive
4. View all their posted drives in a card layout

### Creating a Drive — What Fields Are Needed:

| Field | Example | Purpose |
|-------|---------|---------|
| Company Name | "Google" | Which company is hiring |
| Role | "Software Engineer Intern" | Job position |
| Package (CTC) | "12 LPA" | Salary offered |
| Drive Link | "https://forms.google.com/..." | External application link |
| Description | "2025 campus hiring for B.Tech..." | Details about the drive |
| Expiry Date | "2026-03-15" | Last date to apply |
| **Min CGPA** | 7.0 | Minimum CGPA required |
| **Max Backlogs** | 0 | Maximum backlogs allowed |
| **Eligible Departments** | CSE, IT, AIML | Which branches can apply |

The last 3 fields are **eligibility criteria** — this is what makes our system smart.

### How Drive Creation Works (Backend Flow):

1. Faculty fills the form and clicks "Create Drive"
2. Frontend sends `POST /api/drives` with all the data + faculty's JWT token
3. Backend middleware `protectFaculty()` verifies the token → confirms it's a real faculty member
4. A new row is created in the `drives` table
5. Eligible departments are stored in a separate **junction table** called `drive_eligible_departments` (e.g., driveId=1 + department="CSE", driveId=1 + department="IT")
6. **Email notifications** are automatically sent to ALL registered students in those eligible departments
7. The drive appears on the faculty's dashboard

### What Happens When Faculty Edits a Drive:
- Backend detects what changed (e.g., package updated, deadline extended)
- Sends a **new email** to affected students with the changes highlighted
- This is done in a "fire-and-forget" pattern (email errors don't block the update)

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/models/Drive.js` | Drive table + DriveEligibleDepartment junction table |
| `backend/controllers/driveController.js` | `createDrive()`, `getAllDrivesFaculty()`, `updateDrive()`, `deleteDrive()` |
| `backend/routes/driveRoutes.js` | All drive API endpoints |
| `frontend/src/pages/FacultyDashboard.js` | Faculty drive management UI — cards with edit/delete buttons |

### Faculty API Endpoints:
```
POST   /api/drives           → Create new drive (requires faculty JWT)
GET    /api/drives/faculty   → Get all drives I created
PUT    /api/drives/:id       → Update a drive
DELETE /api/drives/:id       → Delete a drive
```

### Demo Steps (Faculty Side):
1. Login as faculty (register a new faculty if needed)
2. You'll see the Faculty Dashboard
3. Click "Create New Drive"
4. Fill in: Company = "Google", Role = "SDE Intern", Package = "12 LPA"
5. Set Min CGPA = 7.0, Max Backlogs = 0
6. Select departments: CSE, IT
7. Set an expiry date (any future date)
8. Click Create → show the drive card appears
9. Click Edit on the card → change the package → Save
10. Show the drive is updated

---

## PART 2: Student Dashboard — Browsing & Applying to Drives

### What Students See:
- A list of **active, non-expired** drives
- Drives are **automatically filtered** — students only see drives for their department
  - Example: A MECH student won't see drives posted only for CSE and IT
- Each drive card shows: company name, role, package, deadline, eligibility info

### The Eligibility System (IMPORTANT — Explain This Well):

When a student tries to apply to a drive, the system checks:

```
CHECK 1: Is the student's department in the drive's eligible departments?
         Example: Student is CSE, drive allows CSE and IT → PASS

CHECK 2: Is the student's CGPA >= the drive's minimum CGPA?
         Example: Student CGPA = 8.5, drive requires 7.0 → PASS

CHECK 3: Is the student's backlogs <= the drive's max backlogs?
         Example: Student has 0 backlogs, drive allows 0 → PASS

CHECK 4: Is the student's profile completed?
         Example: Student filled CGPA, backlogs, name → PASS

ALL 4 PASS → Student can apply
ANY FAIL → System shows which criteria is not met
```

### Apply Dialog:
When a student clicks "Apply" on a drive:
1. A popup (dialog) opens showing:
   - The student's CGPA, backlogs, department
   - Green checkmarks for criteria they meet
   - Red crosses for criteria they don't meet
2. If eligible → "Apply" button is active → student clicks it
3. Application is saved with status: **"interested"**
4. Student can later update to **"applied"** (after filling external form)

### How Application Works (Backend Flow):

1. Student clicks Apply → `POST /api/drives/apply/:driveId`
2. Backend checks: Does this student meet ALL eligibility criteria?
3. Backend checks: Has this student already applied? (unique constraint on studentId + driveId)
4. If all good → creates a row in `drive_applications` table with status = "interested"
5. Student can later call `PATCH /api/drives/apply/:driveId` to update status to "applied"

### Database Schema for Drives:

```
drives table
├── id (auto-increment primary key)
├── companyName (string)
├── role (string)
├── package (string)
├── driveLink (URL string)
├── description (text)
├── minCGPA (decimal, default 0)
├── maxBacklogs (integer, default 0)
├── expiryDate (date)
├── isActive (boolean, default true)
├── postedBy (foreign key → faculty.id)
└── createdAt, updatedAt

drive_eligible_departments table (junction table)
├── driveId (foreign key → drives.id)
└── department (string: CSE/ECE/EEE/MECH/CIVIL/IT/AIDS/AIML)

drive_applications table
├── id
├── studentId (foreign key → students.id)
├── driveId (foreign key → drives.id)
├── status ("interested" or "applied")
└── Unique constraint: one application per student per drive
```

### Key Files:
| File | What It Does |
|------|-------------|
| `backend/models/Drive.js` | Drive model + DriveEligibleDepartment model |
| `backend/models/DriveApplication.js` | Application tracking model |
| `backend/controllers/driveController.js` | `getActiveDrivesStudent()`, `applyToDrive()`, `updateApplicationStatus()` |
| `frontend/src/pages/StudentDashboard.js` | Student drive browsing UI |
| `frontend/src/components/ApplyDialog.js` | The apply popup with eligibility checks |

### Student API Endpoints:
```
GET    /api/drives/student       → Get active drives for my department
POST   /api/drives/apply/:id    → Apply to a drive (status: interested)
PATCH  /api/drives/apply/:id    → Update status to "applied"
```

### Demo Steps (Student Side):
1. Login as a student (make sure profile is completed with CGPA and backlogs)
2. Go to Student Dashboard → show the drive cards
3. Click "Apply" on the drive you created as faculty
4. Show the Apply Dialog → point out the eligibility checks (green checkmarks)
5. Click Apply → show status changes to "Interested"
6. Click again → update to "Applied"
7. Say: "The student now only sees drives relevant to their department, and the system automatically checks if they're eligible based on their CGPA and backlogs"

---

## PART 3: Email Notifications for Drives

Briefly mention (Tanisha will cover emails in more detail):

> "When a faculty creates a new drive, ALL registered students in the eligible departments automatically receive an email notification with the company name, role, package, and deadline. If the faculty updates a drive, students get another email highlighting what changed. There's also a daily cron job that runs at 8 AM to remind students about drives expiring that day."

---

## PART 4: Hand Over to Tanisha

After your demo, say:

> "So we've seen how the placement drive system works end-to-end — from faculty creating drives to students applying. Now Tanisha will show you our **Assignment System**, **Study Materials**, and **Email Notification System**."

---

## Questions You Might Get Asked

| Question | Your Answer |
|----------|-------------|
| "How do you prevent duplicate applications?" | We have a unique constraint on (studentId + driveId) in the database. If a student tries to apply twice, the database rejects it and the backend returns an error. |
| "What happens when a drive expires?" | The Drive model has a getter method that checks if the current date is past the expiry date. Expired drives are filtered out and not shown to students. |
| "Can students see drives from other departments?" | No. The query joins the drives table with drive_eligible_departments and filters by the student's department. A MECH student only sees drives that include MECH in eligible departments. |
| "What if a student doesn't meet the CGPA requirement?" | The Apply Dialog shows them which criteria they don't meet with red indicators. The Apply button is disabled, so they can't submit. The backend also validates in case someone tries to bypass the frontend. |
| "What is a junction table?" | It's a table that connects two other tables in a many-to-many relationship. One drive can have many eligible departments, and one department can be in many drives. The junction table stores each combination as a row. |
| "What does CRUD mean?" | Create, Read, Update, Delete — the 4 basic operations you can do with data. Faculty can Create drives, Read (view) them, Update details, and Delete them. |

---

**Your total time: ~6-7 minutes. Then hand over to Tanisha.**
