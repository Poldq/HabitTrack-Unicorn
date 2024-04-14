const mongoose = require('mongoose');
const Habit = require('./habitSchema');

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

HabitPlanSchema.pre('deleteOne', async function(next){
    const userId = this.getQuery()['user_id']
    try {
        const habitPlan = await HabitPlan.findOne({user_id: userId});
        if (habitPlan) {
            await Habit.deleteMany({habitPlan_id: habitPlan._id})
        }
        next()
        
    } catch (error) {
        next(error)
    }
})

HabitPlanSchema.index({ user_id:1 }, {unique:true, sparse: true});

const HabitPlan = mongoose.model('HabitPlan', HabitPlanSchema);

module.exports = HabitPlan;