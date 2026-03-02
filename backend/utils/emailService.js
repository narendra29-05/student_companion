const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { Op } = require('sequelize');
const Student = require('../models/Student');
const { Drive, DriveEligibleDepartment } = require('../models/Drive');

let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10) || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    return transporter;
};

const sendEmail = async ({ to, subject, html }) => {
    try {
        await getTransporter().sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error.message);
    }
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background: #f4f4f7; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: #4f46e5; padding: 24px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .header-urgent { background: #dc2626; padding: 24px; text-align: center; }
        .header-urgent h1 { color: #ffffff; margin: 0; font-size: 24px; }
        .body { padding: 32px 24px; color: #333333; line-height: 1.6; }
        .footer { padding: 16px 24px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
        .btn { display: inline-block; padding: 12px 24px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0; }
        .btn-urgent { display: inline-block; padding: 12px 24px; background: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0; }
        .detail { background: #f8f9fa; padding: 12px 16px; border-radius: 6px; margin: 12px 0; }
        .detail strong { color: #4f46e5; }
        .change { background: #fef3c7; padding: 8px 12px; border-left: 4px solid #f59e0b; margin: 8px 0; border-radius: 0 6px 6px 0; }
        .urgent-box { background: #fef2f2; padding: 12px 16px; border-left: 4px solid #dc2626; margin: 12px 0; border-radius: 0 6px 6px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="${content._urgent ? 'header-urgent' : 'header'}"><h1>Student Companion</h1></div>
        <div class="body">${content._html || content}</div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} Student Companion. All rights reserved.
        </div>
    </div>
</body>
</html>
`;

// Helper to format dates nicely
const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Friendly labels for drive fields
const fieldLabels = {
    companyName: 'Company Name',
    role: 'Role',
    driveLink: 'Drive Link',
    description: 'Description',
    minCGPA: 'Minimum CGPA',
    package: 'Package',
    expiryDate: 'Expiry Date',
    isActive: 'Active Status',
};

// --- Welcome Email ---
const sendWelcomeEmail = async (student) => {
    const html = `
        <h2>Welcome, ${student.name}!</h2>
        <p>Your account has been created successfully. Here are your details:</p>
        <div class="detail">
            <strong>Roll Number:</strong> ${student.rollNumber}<br>
            <strong>Department:</strong> ${student.department}<br>
            <strong>Year:</strong> ${student.year}${student.section ? ` | Section: ${student.section}` : ''}
        </div>
        <p>You can now log in to access placement drives, study materials, and more.</p>
    `;

    await sendEmail({
        to: student.collegeEmail,
        subject: 'Welcome to Student Companion!',
        html: baseTemplate(html),
    });
};

// --- New Drive Email ---
const sendNewDriveEmail = async (student, drive) => {
    const html = `
        <h2>New Placement Drive</h2>
        <p>Hi ${student.name},</p>
        <p>A new placement drive is available that matches your department:</p>
        <div class="detail">
            <strong>Company:</strong> ${drive.companyName}<br>
            <strong>Role:</strong> ${drive.role}<br>
            ${drive.package ? `<strong>Package:</strong> ${drive.package}<br>` : ''}
            ${drive.minCGPA ? `<strong>Min CGPA:</strong> ${drive.minCGPA}<br>` : ''}
            <strong>Last Date:</strong> ${formatDate(drive.expiryDate)}
        </div>
        <a href="${drive.driveLink}" class="btn">Apply Now</a>
        <p>Don't miss out — apply before the deadline!</p>
    `;

    await sendEmail({
        to: student.collegeEmail,
        subject: `New Drive: ${drive.companyName} — ${drive.role}`,
        html: baseTemplate(html),
    });
};

// --- Drive Updated Email (with specific changes) ---
const sendDriveUpdateEmail = async (student, drive, changes) => {
    let changesHtml = '';
    for (const change of changes) {
        if (change.field === 'expiryDate') {
            changesHtml += `<div class="change"><strong>${change.label}:</strong> ${formatDate(change.oldVal)} → ${formatDate(change.newVal)}</div>`;
        } else {
            changesHtml += `<div class="change"><strong>${change.label}:</strong> ${change.oldVal} → ${change.newVal}</div>`;
        }
    }

    const html = `
        <h2>Drive Updated</h2>
        <p>Hi ${student.name},</p>
        <p>The placement drive for <strong>${drive.companyName} — ${drive.role}</strong> has been updated:</p>
        ${changesHtml}
        <div class="detail">
            <strong>Company:</strong> ${drive.companyName}<br>
            <strong>Role:</strong> ${drive.role}<br>
            ${drive.package ? `<strong>Package:</strong> ${drive.package}<br>` : ''}
            <strong>Last Date:</strong> ${formatDate(drive.expiryDate)}
        </div>
        <a href="${drive.driveLink}" class="btn">View Drive</a>
    `;

    await sendEmail({
        to: student.collegeEmail,
        subject: `Drive Updated: ${drive.companyName} — ${drive.role}`,
        html: baseTemplate(html),
    });
};

// --- Last Day Deadline Reminder Email ---
const sendDeadlineReminderEmail = async (student, drive) => {
    const urgentContent = {
        _urgent: true,
        _html: `
            <h2>Last Day to Apply!</h2>
            <p>Hi ${student.name},</p>
            <div class="urgent-box">
                <strong>Today is the last day</strong> to apply for the following placement drive. Don't miss this opportunity!
            </div>
            <div class="detail">
                <strong>Company:</strong> ${drive.companyName}<br>
                <strong>Role:</strong> ${drive.role}<br>
                ${drive.package ? `<strong>Package:</strong> ${drive.package}<br>` : ''}
                <strong>Deadline:</strong> ${formatDate(drive.expiryDate)}
            </div>
            <a href="${drive.driveLink}" class="btn-urgent">Apply Now — Last Chance!</a>
            <p>This drive expires <strong>today</strong>. Apply immediately if you haven't already.</p>
        `,
    };

    await sendEmail({
        to: student.collegeEmail,
        subject: `LAST DAY: ${drive.companyName} — ${drive.role} expires today!`,
        html: baseTemplate(urgentContent),
    });
};

// --- Detect what changed between old and new drive ---
const detectChanges = (oldDrive, newData) => {
    const changes = [];
    const fieldsToCheck = ['companyName', 'role', 'driveLink', 'description', 'minCGPA', 'package', 'expiryDate', 'isActive'];

    for (const field of fieldsToCheck) {
        if (newData[field] === undefined) continue;

        let oldVal = oldDrive[field];
        let newVal = newData[field];

        // Normalize dates for comparison
        if (field === 'expiryDate') {
            oldVal = new Date(oldVal).toISOString().split('T')[0];
            newVal = new Date(newVal).toISOString().split('T')[0];
        }

        // Normalize numbers
        if (field === 'minCGPA') {
            oldVal = parseFloat(oldVal) || 0;
            newVal = parseFloat(newVal) || 0;
        }

        if (String(oldVal) !== String(newVal)) {
            changes.push({
                field,
                label: fieldLabels[field] || field,
                oldVal: oldVal || 'N/A',
                newVal: newVal || 'N/A',
            });
        }
    }

    return changes;
};

// --- Notify eligible students (new drive) ---
const notifyNewDrive = async (drive, departments) => {
    try {
        const where = {};
        // If departments list is non-empty and doesn't include 'ALL', filter by department
        const hasAll = departments && departments.includes('ALL');
        if (departments && departments.length > 0 && !hasAll) {
            where.department = departments;
        }
        // If 'ALL' or empty list → no department filter, sends to everyone

        const students = await Student.findAll({ where });
        if (students.length === 0) return;

        const BATCH_SIZE = 10;
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
            const batch = students.slice(i, i + BATCH_SIZE);
            await Promise.allSettled(
                batch.map((s) => sendNewDriveEmail(s, drive))
            );
        }

        console.log(`New drive notification sent to ${students.length} student(s)`);
    } catch (error) {
        console.error('Failed to notify students (new drive):', error.message);
    }
};

// --- Notify eligible students (drive updated with changes) ---
const notifyDriveUpdate = async (drive, departments, changes) => {
    try {
        if (changes.length === 0) return; // no actual changes, skip

        const where = {};
        const hasAll = departments && departments.includes('ALL');
        if (departments && departments.length > 0 && !hasAll) {
            where.department = departments;
        }

        const students = await Student.findAll({ where });
        if (students.length === 0) return;

        const BATCH_SIZE = 10;
        for (let i = 0; i < students.length; i += BATCH_SIZE) {
            const batch = students.slice(i, i + BATCH_SIZE);
            await Promise.allSettled(
                batch.map((s) => sendDriveUpdateEmail(s, drive, changes))
            );
        }

        console.log(`Drive update notification sent to ${students.length} student(s) — changes: ${changes.map((c) => c.label).join(', ')}`);
    } catch (error) {
        console.error('Failed to notify students (drive update):', error.message);
    }
};

// --- Daily cron: send deadline reminders for drives expiring today ---
const startDeadlineReminderCron = () => {
    // Runs every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        try {
            console.log('Running deadline reminder check...');

            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            // Find active drives expiring today
            const drives = await Drive.findAll({
                where: {
                    isActive: true,
                    expiryDate: { [Op.between]: [todayStart, todayEnd] },
                },
                include: [{ model: DriveEligibleDepartment, as: 'eligibleDepartments' }],
            });

            if (drives.length === 0) {
                console.log('No drives expiring today');
                return;
            }

            for (const drive of drives) {
                const departments = drive.eligibleDepartments.map((ed) => ed.department);
                const hasAll = departments.includes('ALL');
                const where = {};
                if (departments.length > 0 && !hasAll) {
                    where.department = departments;
                }

                const students = await Student.findAll({ where });

                const BATCH_SIZE = 10;
                for (let i = 0; i < students.length; i += BATCH_SIZE) {
                    const batch = students.slice(i, i + BATCH_SIZE);
                    await Promise.allSettled(
                        batch.map((s) => sendDeadlineReminderEmail(s, drive))
                    );
                }

                console.log(`Deadline reminder sent for "${drive.companyName}" to ${students.length} student(s)`);
            }
        } catch (error) {
            console.error('Deadline reminder cron failed:', error.message);
        }
    });

    console.log('Deadline reminder cron scheduled (daily at 8:00 AM)');
};

module.exports = {
    sendWelcomeEmail,
    notifyNewDrive,
    notifyDriveUpdate,
    detectChanges,
    startDeadlineReminderCron,
};
