import User from '../models/user';
import validate from '../utils/validate';

class UserController {
	constructor(userService) {
		this.userService = userService;
	}

	async createUser(req, res) {
		const errors = validate.registerValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		const { name, email, password } = req.body;

		const user = new User({
			name,
			email,
			password
		});

		try {
			const createUser = await this.userService.createUser(user);

			return res.status(201).json({
				status: 201,
				success: true,
				data: createUser
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}
}

export default UserController;
