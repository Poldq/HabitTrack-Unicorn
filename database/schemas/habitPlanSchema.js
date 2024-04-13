const mongoose = require('mongoose');

const HabitPlanSchema = new mongoose.Schema({
    name: {
        type:String,
        required:false
    },
    duration_from: {
        type:Date,
        required: true
    },
    duration_to: {
        type:Date,
        required: true
    },
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

HabitPlanSchema.index({ user_id:1 }, {unique:true, sparse: true});

const HabitPlan = mongoose.model('HabitPlan', HabitPlanSchema);

module.exports = HabitPlan;