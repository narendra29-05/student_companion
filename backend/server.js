const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/db');
const { syncDB } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const { startDeadlineReminderCron } = require('./utils/emailService');

dotenv.config();

const app = express();

// CORS — restrict to frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
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
        startDeadlineReminderCron();
    });
};

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
