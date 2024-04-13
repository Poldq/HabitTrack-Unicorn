const createHabitPlanSchema = {
    name: {
        isString : {
			errorMessage: "Name must be a string!",
		}, 
    },

    duration_from : {
        
        notEmpty: {
            errorMessage: 'Duration from cannot be empty',
        },
        isISO8601: {
            errorMessage: 'Invalid date format',
        },
        toDate: true,
    },
    duration_to : {
        
        notEmpty: {
            errorMessage: 'Duration to cannot be empty',
        },
        isISO8601: {
            errorMessage: 'Invalid date format',
        },
        toDate: true,
    },
};


module.exports = createHabitPlanSchema;