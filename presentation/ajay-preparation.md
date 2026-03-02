# Ajay - Presentation Preparation

## Role: Placement Drives System (Faculty + Student)

---

## Your Responsibilities

### 1. Faculty Dashboard - Drive Management
**What to explain:**
- Faculty can create new placement drives with:
  - Company name, role, package (CTC)
  - Drive link (external application URL)
  - Description of the opportunity
  - Expiry date
  - **Eligibility criteria:**
    - Eligible departments (CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML, or ALL)
    - Minimum CGPA requirement
    - Maximum backlogs allowed
- Faculty can edit and delete their own drives
- All drives show in a card-based layout

**Key points to highlight:**
- Multi-department selection (checkboxes)
- Only the faculty who created a drive can edit/delete it
- Drive auto-expires based on expiry date

### 2. Student Dashboard - Browse & Apply
**What to explain:**
- Students see only **active, non-expired** drives
- Drives are **filtered by student's department** automatically
- Each drive card shows company, role, package, and eligibility info
- **Eligibility checking:**
  - Student's CGPA must meet minimum requirement
  - Student's backlogs must be within allowed limit
  - Student's department must be in eligible list
- Apply flow:
  1. Student clicks "Apply" → sees Apply Dialog
  2. Dialog shows their profile info (CGPA, backlogs)
  3. Shows eligibility match status
  4. Profile must be completed before applying
  5. Status changes: Not Applied → Interested → Applied

### 3. Email Notifications for Drives
- When faculty creates a new drive → all eligible students in those departments get email
- When faculty updates a drive → affected students get notified with what changed
- Daily cron job at 8 AM → sends deadline reminders for drives expiring that day

---

## Key Files to Know

| File | What It Does |
|------|-------------|
| `backend/models/Drive.js` | Drive model + DriveEligibleDepartment junction |
| `backend/models/DriveApplication.js` | Tracks student applications (interested/applied) |
| `backend/controllers/driveController.js` | Create, read, update, delete drives + apply logic |
| `backend/routes/driveRoutes.js` | All drive API endpoints |
| `frontend/src/pages/FacultyDashboard.js` | Faculty drive management UI |
| `frontend/src/pages/StudentDashboard.js` | Student drive browsing + apply UI |
| `frontend/src/components/ApplyDialog.js` | Apply confirmation dialog |

---

## API Endpoints to Know

### Faculty Endpoints (require faculty JWT):
```
POST   /api/drives              → Create new drive
GET    /api/drives/faculty      → Get all my drives
PUT    /api/drives/:id          → Update drive
DELETE /api/drives/:id          → Delete drive
```

### Student Endpoints (require student JWT):
```
GET    /api/drives/student      → Get active drives for my department
POST   /api/drives/apply/:id   → Apply to a drive
PATCH  /api/drives/apply/:id   → Update application status
```

---

## Database Schema to Explain

```
Drive Table
├── id, companyName, role, package, driveLink
├── description, minCGPA, maxBacklogs
├── expiryDate, isActive, postedBy (FK → Faculty)
└── timestamps

DriveEligibleDepartment (Junction)
├── driveId (FK → Drive)
└── department (CSE/ECE/EEE/...)

DriveApplication Table
├── studentId (FK → Student)
├── driveId (FK → Drive)
├── status (interested | applied)
└── Unique constraint: (studentId + driveId)
```

---

## How Eligibility Works (Important!)

```
Student applies to drive:
1. Check: Is student's department in drive's eligible departments?
2. Check: Is student's CGPA >= drive's minCGPA?
3. Check: Is student's backlogs <= drive's maxBacklogs?
4. Check: Is student's profile completed?
5. All pass → Allow application
   Any fail → Show which criteria not met
```

---

## Questions You Might Get Asked

1. **How do you prevent duplicate applications?**
   → Unique constraint on (studentId, driveId) in DriveApplication table. Backend checks before creating.

2. **What happens when a drive expires?**
   → `isExpired()` getter method checks expiryDate vs current date. Expired drives don't show to students.

3. **How are department-specific drives filtered?**
   → DriveEligibleDepartment junction table stores which departments a drive targets. Student query joins and filters.

4. **Can students apply to drives they're not eligible for?**
   → No. Backend validates CGPA, backlogs, and department before creating application.

---

## Demo Points (For Live Demo)
1. Login as faculty → Create a new drive with eligibility criteria
2. Login as student → Show drives filtered by department
3. Click on a drive → Show eligibility match in Apply Dialog
4. Apply to the drive → Show status change
5. Show email notification (if possible, show backend log)
