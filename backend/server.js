const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

// --- ROUTES SECTION ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/drives', require('./routes/driveRoutes'));

// Add this inline for now to avoid file import errors
const Todo = require('./models/Todo');
const { protectStudent } = require('./middleware/authMiddleware');

app.get('/api/todos', protectStudent, async (req, res) => {
    const todos = await Todo.find({ student: req.student._id });
    res.json({ success: true, todos });
});

app.post('/api/todos', protectStudent, async (req, res) => {
    const todo = await Todo.create({ task: req.body.task, student: req.student._id });
    res.json({ success: true, todo });
});

app.delete('/api/todos/:id', protectStudent, async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// --- 404 HANDLER MUST BE LAST ---
app.use((req, res) => res.status(404).send("Not Found"));

app.listen(5000, () => console.log('Server running on 5000'));