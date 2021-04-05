import { ObjectID } from 'mongodb';
import Team from '../models/team';
import validate from '../utils/validate';

class TeamController {
	constructor(userService, adminService, teamService) {
		this.userService = userService;
		this.adminService = adminService;
		this.teamService = teamService;
	}

	async createTeam(req, res) {
		// The token is already passed through the middleware
		const tokenMetadata = req.tokenMetadata;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		const errors = validate.teamValidate(req);

		if (erros.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		const { name } = req.body;

		try {
			const adminId = tokenMetadata._id;

			// Verify that the admin is the one who's sending the request
			const admin = await this.adminService.getAdmin(adminId);
			const team = new Team({
				name,
				admin: admin._id
			});

			const createdTeam = await this.adminService.createTeam(team);

			return res.status(201).json({
				status: 201,
				sucees: true,
				data: createdTeam
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			})
		}
	}
}

export default TeamController;
