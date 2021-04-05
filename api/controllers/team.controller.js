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
		const { tokenMetadata } = req;

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

	async updateTeam(req, res) {
		// As we know the token metadata are already there
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		// Check the request param
		const { id } = req.params;

		if (!ObjectId.isValid(id)) {
			return res.status(400).json({
				status: 400,
				success: false,
				error: 'team id is not valid'
			});
		}

		const errors = validate.teamValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		const { name } = req.body;

		try {
			const adminId = tokenMetadata._id;

			// Check if the team exists and the owner is legit (if its admin)
			const team = await this.teamService.adminGet(id);

			if (team.admin._id.toHexString() !== adminId) {
				return res.status(401).json({
					status: 401,
					success: false,
					error: 'Unothorized'
				});
			}

			team.name = name;

			const updatedTeam = await this.teamService.updateTeam(team);

			return res.status(200).json({
				status: 200,
				success: true,
				data: updatedTeam
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}

	async deleteTeam(req, res) {
		// The token metadata is already been set
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		// check the request param for the id
		const { id } = req.params;

		if (!ObjectID.isValid(id)) {
			return res.status(400).json({
				status: 400,
				success: false,
				error: 'Team id is not valid'
			});
		}

		try {
			const adminId = tokenMetadata._id;

			// Check if the team exists or the owner is legit
			const team = await this.teamService.adminGetTeam(id);

			if (!team.admin._id.toHexString() !== adminId) {
				return res.status(401).json({
					status: 401,
					success: false,
					error: 'Unothorized you are not the admin'
				});
			}

			// Delete the team
			const status = await this.teamService.deleteTeam(id);

			return res.status(200).json({
				status: 200,
				success: true,
				data: 'Team deleted successfuly'
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}

	async getTeam(req, res) {
		// Check the token metadata
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 501,
				success: false,
				error: 'Unothorized'
			});
		}

		// Check the request param
		const { id } = req.params;

		if (!ObjectID.isValid(id)) {
			return res.status(400).json({
				status: 400,
				success: false,
				error: 'Team id is not valid'
			});
		}

		try {
			const authId = tokenMetadata._id;

			// Verify if the account requesting this team does exists
			await this.userService.getUser(authId);

			try {
				const gottenTeam = await this.teamService.getTeam(id);

				return res.status(200).json({
					status: 200,
					success: true,
					data: gottenTeam
				});
			} catch (error) {
				throw error;
			}
		} catch (error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}

	async getTeams(req, res) {
		// As always check the metadata
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		try {
			const authId = tokenMetadata._id;

			// Verify if the one who's requesting exists (admin or a normal user)
			await this.userService.getUser(authId);

			const teams = await this.teamService.getTeams();

			return res.status(200).json({
				status: 200,
				success: true,
				data: teams
			});
		} catch (error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			})
		}
	}
}

export default TeamController;
