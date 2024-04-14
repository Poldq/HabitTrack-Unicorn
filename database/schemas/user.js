const mongoose = require('mongoose');
const HabitPlan = require('./habitPlanSchema');

const UserSchema = new mongoose.Schema({
    login: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    display_name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
});

UserSchema.pre('deleteOne', async function (next) {
    try {
        const userId = this._conditions._id; // Extracting user ID directly
        // Deleting related habit plans
        await HabitPlan.deleteOne({ user_id: userId._id });
        next();
    } catch (error) {
        console.error("Error deleting user and associated habit plans:", error);
        next(error);
    }
});

const User = mongoose.model('User', UserSchema)

module.exports = User;