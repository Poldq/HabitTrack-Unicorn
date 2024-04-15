const express = require('express');
const router = express.Router();
const HabitPlan = require('../database/schemas/habitPlanSchema');
const checkAuthorization = require('../middlewares/authorizationMiddleware');
const {validationResult , checkSchema, matchedData} = require('express-validator');
const createHabitPlanSchema = require('../utils/habitPlanValidationSchema');
const checkHabitPlan = require('../middlewares/habitPlanMiddleware');
const { checkStreaks } = require('../middlewares/streakMiddleware');

router.post('/', checkAuthorization, checkSchema(createHabitPlanSchema), async (req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
      }
  
    const data = matchedData(req);
    const userId = req.user
    try {
        const newHabitPlan = new HabitPlan({
            name: data.name,
            duration_from: data.duration_from,
            duration_to: data.duration_to,
            user_id: userId
        })
        const savedHabitPlan = await newHabitPlan.save();
        return res.status(201).json(savedHabitPlan);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(422).json({error:'User already have a Habit Plan'})
        }
        return res.status(500).json({error:'Internal Server Error'});
    }
 

});
router.delete('/', checkAuthorization, async (req, res)=> {
const userId = req.user
    try {
    const isDeleted = await HabitPlan.deleteOne({user_id: userId});
    if(!isDeleted) {
        return res.status(422).json({error:'Deletion failed'});
    }
    return res.status(200).json({message: 'Habit Plan is deleted'});
} catch (error) {
    return res.status(500).json({error: 'Internal Server Error'});
}
});

router.get('/', checkAuthorization, checkHabitPlan, checkStreaks, async (req, res) => {
    const habits = req.habits
    const habitPlan = req.habitPlan
    return res.status(200).json({habitPlan, habits});
});


router.put('/', checkAuthorization, async (req,res)=> {
    const userId = req.user
    const newData = req.body
    try {
        const updatedHabitPlan = await HabitPlan.updateOne({user_id: userId},newData,{new: true});
        if(!updatedHabitPlan) {
            return res.status(422).json({error: 'Update failed'});
        }
        return res.status(200).json(updatedHabitPlan);
    } catch (error) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
});



module.exports = router;