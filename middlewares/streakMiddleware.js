const Habit = require('../database/schemas/habitSchema') ;
const checkStreaks = async (req, res, next) => {
    try {
        const habitPlanID = req.habitPlanID;
        const habits = await Habit.find({ habitPlan_id: habitPlanID });
        const currentDate = new Date();
        for (const habit of habits) {
            const lastUpdated = habit.lastUpdated;
            if (lastUpdated) {
                const lastUpdatedMidnight = new Date(lastUpdated);
                lastUpdatedMidnight.setHours(0, 0, 0, 0);
                const timeElapsedAfterMid = currentDate - lastUpdatedMidnight;
                const hoursElapsedAfterMid = timeElapsedAfterMid / (1000 * 60 * 60);
                if (hoursElapsedAfterMid > 23.9) {
                    habit.streak = 0;
                    await habit.save();
                }
            }
        }
        req.habits = habits
        next();
    } catch (error) {
        return res.status(500).json("Internal Server Error");
    }
};

 module.exports = {
   checkStreaks
};
