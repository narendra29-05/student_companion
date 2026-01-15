const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Job role is required']
    },
    driveLink: {
        type: String,
        required: [true, 'Drive link is required']
    },
    description: {
        type: String
    },
    eligibleDepartments: [{
        type: String
    }],
    minCGPA: {
        type: Number,
        default: 0
    },
    package: {
        type: String
    },
    expiryDate: {
        type: Date,
        required: [true, 'Expiry date is required']
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual to check if drive is expired
driveSchema.virtual('isExpired').get(function() {
    return new Date() > this.expiryDate;
});

driveSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Drive', driveSchema);
