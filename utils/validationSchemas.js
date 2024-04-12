const registerUserValidationSchema = {
	login: {
		isLength: {
			options: {
				min: 6,
				max: 32,
			},
			errorMessage:
				"Login must be at least 6 characters with a max of 32 characters",
		},
		notEmpty: {
			errorMessage: "Login cannot be empty",
		},
		isString: {
			errorMessage: "Login must be a string!",
		},
	},
	display_name: {
		notEmpty: {
            errorMessage: "Display Name cannot be empty"
        },
	},
	password: {
				isLength: {
			options: {
				min: 8,
				max: 32,
			},
			errorMessage:
				"Password must be at least 8 characters with a max of 32 characters",
		},
		notEmpty: {
			errorMessage: "Password cannot be empty",
		},
		isString: {
			errorMessage: "Password must be a string!",
		},
	},
};

module.exports = registerUserValidationSchema;
