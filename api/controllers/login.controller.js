import validate from '../utils/validate';

class LoginController {
	constructor(loginService) {
		this.loginService = loginService;
	}

	async login(req, res) {
		const errors = validate.loginValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		const { email, password } = req.body;

		try {
			const token = await this.loginService.login(email, password);

			return res.status(200).json({
				status: 200,
				success: true,
				token
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			});
		}
	}
}

export default LoginController;
