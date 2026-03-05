const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const { syncDB } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { startDeadlineReminderCron, verifyTransporter, sendTestEmail } = require('./utils/emailService');

dotenv.config();

const app = express();

// CORS — allow frontend origins
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting on auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, message: 'Too many attempts, please try again after 15 minutes' },
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/drives', require('./routes/driveRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Test email endpoint (for debugging email issues)
app.post('/api/test-email', async (req, res) => {
    const { to } = req.body;
    if (!to) {
        return res.status(400).json({ success: false, message: 'Please provide "to" email address' });
    }
    try {
        const result = await sendTestEmail(to);
        if (result) {
            res.json({ success: true, message: `Test email sent to ${to}` });
        } else {
            res.status(500).json({ success: false, message: 'Failed to send test email. Check server logs for details.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: `Email error: ${error.message}` });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    await syncDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);

        // Verify email configuration at startup
        const emailVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
        const missing = emailVars.filter((v) => !process.env[v]);
        if (missing.length > 0) {
            console.warn(`[Email] Missing env vars: ${missing.join(', ')} — email notifications will fail`);
        } else {
            // Verify SMTP connection at startup
            const emailOk = await verifyTransporter();
            if (emailOk) {
                console.log('[Email] SMTP ready — emails will be delivered');
            } else {
                console.error('[Email] SMTP verification FAILED — emails will NOT work. Check EMAIL_USER and EMAIL_PASS in .env');
                console.error('[Email] For Gmail: ensure 2-Step Verification is ON and generate a new App Password at https://myaccount.google.com/apppasswords');
            }
        }

        startDeadlineReminderCron();
    });
};

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
