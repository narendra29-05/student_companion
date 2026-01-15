const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: [true, 'Roll number is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    collegeEmail: {
        type: String,
        required: [true, 'College email is required'],
        unique: true,
        lowercase: true,
        match: [/^[\w-\.]+@[\w-]+\.(edu|ac\.in|edu\.in)$/i, 'Please use valid college email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt before saving
// Hash password before saving
studentSchema.pre('save', async function() {
    // 1. Only hash if password is modified
    if (!this.isModified('password')) {
        return; // Just return, don't call next()
    }

    try {
        // 2. Generate salt and hash
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // 3. No next() needed here! 
    } catch (error) {
        throw error; // Mongoose will catch this and pass it to your error handler
    }
});

// Compare entered password with hashed password in database
studentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);