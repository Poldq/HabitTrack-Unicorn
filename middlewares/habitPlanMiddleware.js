const HabitPlan = require('../database/schemas/habitPlanSchema');

const checkHabitPlan = async (req, res, next) => {
    try {
        const habitPlan = await HabitPlan.findOne({ user_id: req.user });
        if (!habitPlan) {
            return res.status(404).json({ error: 'User does not have a habit plan' });
        }
        req.habitPlanID = habitPlan._id
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = checkHabitPlan;