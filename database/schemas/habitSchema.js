const mongoose = require('mongoose')

const HabitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['develop', 'quit'], 
        required: true,
    },
    streak: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
    },
    habitPlan_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'HabitPlan',
        required: true
    }
});

const Habit = mongoose.model('Habit', HabitSchema)

module.exports = Habit;