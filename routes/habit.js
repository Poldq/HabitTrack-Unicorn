const express = require('express');
const router = express.Router();
const Habit = require('../database/schemas/habitSchema');
const checkHabitPlan = require('../middlewares/habitPlanMiddleware');
const checkAuthorization = require("../middlewares/authorizationMiddleware")
const {validationResult , checkSchema, matchedData} = require('express-validator');
const {habitCreateSchema, habitUpdateSchema} = require('../utils/habitValidationSchema');

router.post('/', 
    checkAuthorization, checkHabitPlan, checkSchema(habitCreateSchema), 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {    
            return res.status(422).json({ errors: errors.array()});
        }
        const data = matchedData(req);

        const habitPlanID = req.habitPlanID
        try {
            const newHabit = new Habit({
               name: data.name,
                description: data.description,
                status: data.status,
                habitPlan_id: habitPlanID
            });
            const savedHabit = await newHabit.save();
            return res.status(201).json(savedHabit);
        } catch (error) {
            console.error('Error saving habit:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
});

router.put('/:habitID', checkAuthorization, checkHabitPlan, checkSchema(habitUpdateSchema), async(req, res)=>{
    const {habitID} = req.params
    const newData = req.body
    try {
        const updatedHabit = await Habit.updateOne({_id:habitID},newData,{new: true});
        if(!updatedHabit) {
            return res.status(422).json({error: 'Update failed'});
        }
        return res.status(200).json({message:'Updated successfully'});
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }

});


router.delete('/:habitID', checkAuthorization, checkHabitPlan, async(req, res)=>{
    const{habitID} = req.params
    try {
        const deletedHabit = await Habit.deleteOne({_id:habitID});
        if(!deletedHabit){
            return res.status(422).json({error:'Deletion failed'});
        }
        return res.status(200).json({message: 'Successfully deleted'});
    } catch (error) {
        return res.status(500).json({error:'Internal Server Error'});
    }
});

router.get('/', checkAuthorization, checkHabitPlan, async(req, res)=> {
    habitPlanID = req.habitPlanID
    try {
        const habits = await Habit.find({habitPlan_id: habitPlanID})
        const currentDate = new Date();

        for (const habit of habits) {
            const lastUpdated = habit.lastUpdated;
            if (lastUpdated) {
                const lastUpdatedMidnight = lastUpdated.setHours(0, 0, 0, 0);
                const timeElapsedAfterMid = currentDate - lastUpdatedMidnight;
                const hoursElapsedAfterMid = timeElapsedAfterMid / (1000 * 60 * 60);
                
                if (hoursElapsedAfterMid > 23.9) {
                    habit.streak = 0;
                    await habit.save();
                }
            }
        }
        return res.status(200).json(habits)
    } catch (error) {
        return res.status(500).json("Internal Server Error")
    }
    
    
})
// for fast loading of habits, for tests only
// router.get('/load_habits', checkAuthorization, checkHabitPlan, async(req, res)=> {
//     const habitPlanID = req.habitPlanID
//     new Date(Date.now() - 4 * 60 * 60 * 1000);
//     try {
//         const newHabit1 = new Habit({
//            name: "walk",
//             description: "with dog",
//             status: "develop",
//             habitPlan_id: habitPlanID,
//             streak: 10,
//             lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),//4 hours
//         });

//         const newHabit2 = new Habit({
//             name: "exercise",
//             description: "cardio workout",
//             status: "develop",
//             habitPlan_id: habitPlanID,
//             streak: 5,
//             lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), //4 days
//         });

//         const newHabit3 = new Habit({
//             name: "sosat",
//             description: "",
//             status: "develop",
//             habitPlan_id: habitPlanID,
//             streak: 5,
//             lastUpdated: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000), //4 days
//         });

//     await newHabit1.save();
//     await newHabit2.save();
//     await newHabit3.save();
//         return res.status(201).json({ message: "Habit added successfully",  });
//     } catch (error) {
//         return res.status(500).json(error);
//     }
// });

router.post('/:habitId/done', checkAuthorization, checkHabitPlan, async(req,res)=>{
    const {habitId} = req.params
    try { 
        const habit = await Habit.findById({_id:habitId});
        const currentDate = new Date();
        const lastUpdated = habit.lastUpdated;
        if (!lastUpdated) {
            habit.streak = 1;
            habit.lastUpdated = currentDate
            await habit.save()
            return res.status(200).json({message:"Successfully saved"})
        }
        
        const lastUpdatedMidnight = lastUpdated.setHours(23, 59, 59, 59);
        //getting time since last update before midnight
        const timeElapsedBeforeMid = lastUpdatedMidnight - lastUpdated
        // translating timeElapsedBeforeMid into hours
        const hoursElapseBeforeMid = timeElapsedBeforeMid/ (1000 * 60 * 60)
        //getting time since last update after midnight
        const timeElapsedAfterMid = currentDate - lastUpdatedMidnight;
        //translating timeElapsedAfterMid into hours
        const hoursElapsedAfterMid = timeElapsedAfterMid / (1000 * 60 * 60);
        //if duration since last update after mid is less than a day than streak + 1
        //and if duration since last update before mid is bigger than hours
        if(hoursElapsedAfterMid < 23.9 && hoursElapsedAfterMid > hoursElapseBeforeMid) {
            habit.streak += 1;
            habit.lastUpdated = currentDate;
        } else  if (hoursElapsedAfterMid > 23.9) {
            habit.streak = 1;
        } else {
            // this means that it's still the same day as the lastUpdated
            return res.status(422).json({message: "Nothing to change"})
        }

        await habit.save();

        return res.status(200).json({ message: "Habit updated successfully" });
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'})
    }
});


module.exports = router;
