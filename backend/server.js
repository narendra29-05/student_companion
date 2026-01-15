const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Load environment variables
dotenv.config();

// 2. Connect to Database
connectDB();

const app = express();

// 3. Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// 4. Import routes
const authRoutes = require('./routes/authRoutes');
const driveRoutes = require('./routes/driveRoutes');

// Debug logs to ensure files are imported correctly
console.log('--- System Check ---');
console.log('Auth Routes loaded:', !!authRoutes);
console.log('Drive Routes loaded:', !!driveRoutes);
console.log('--------------------');

// 5. Use routes
// Note: All routes in authRoutes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);

// 6. Home route
app.get('/', (req, res) => {
    res.json({ message: '🎓 Campus Placement Portal API is running!' });
});

// 7. 404 Handler (If no route matches)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found - ${req.originalUrl}`
    });
});

// 8. Global Error Handling Middleware
// This must have 4 arguments (err, req, res, next) to be recognized as an error handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    console.error('❌ ERROR:', err.message);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// 9. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});