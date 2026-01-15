const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const facultySchema = new mongoose.Schema({
    facultyId: {
        type: String,
        required: [true, 'Faculty ID is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    collegeEmail: {
        type: String,
        required: [true, 'College email is required'],
        unique: true,
        lowercase: true
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Updated Pre-save logic
facultySchema.pre('save', async function() {
    // If password is not modified, simply return to stop the function
    if (!this.isModified('password')) {
        return; 
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // No next() call needed here!
});

facultySchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Faculty', facultySchema);