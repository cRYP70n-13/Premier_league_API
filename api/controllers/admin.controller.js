import User from '../models/user';
import validate from '../utils/validate';

class AdminController {
	constructor(adminService) {
		this.adminService = adminService;
	}

	async createAdmin(req, res) {
		const erros = validate.registerValidate(req);

		if (erros.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		const { name, email, password } = req.body;
		const admin = new User({
			name: name.trim(),
			email: email.trim(),
			password
		});

		try {
			const createAdmin = await this.adminService.createAdmin(admin);

			return res.status(201).json({
				status: 201,
				success: true,
				data: createAdmin
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

export default AdminController;
