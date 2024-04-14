const habitCreateSchema = {
    name: {
        isString : {
			errorMessage: "Name must be a string!",
		}, 
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        }
    },
    description : {

        isString: {
            errorMessage: 'Description must be a string!',
        },
        optional: true,
    },
    status: {
        isIn: {
            options: [['develop', 'quit']],
            errorMessage: 'Invalid status',
        },
        notEmpty: {
            errorMessage: 'Status is required',
        },
    },
};

const habitUpdateSchema = {
    name: {
        isString : {
			errorMessage: "Name must be a string!",
		}, 
        notEmpty: {
            errorMessage: 'Name cannot be empty',
        },
        optional: true,

    },
    description : {

        isString: {
            errorMessage: 'Description must be a string!',
        },
        optional: true,
    },
    status: {
        isIn: {
            options: [['develop', 'quit']],
            errorMessage: 'Invalid status',
        },
        notEmpty: {
            errorMessage: 'Status is required',
        },
        optional: true,

    },
}


module.exports = {habitCreateSchema,habitUpdateSchema};