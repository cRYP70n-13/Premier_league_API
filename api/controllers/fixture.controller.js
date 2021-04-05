import _ from 'loadsh';
import { ObjectID } from 'mongodb';
import Fixture from '../models/fixture';
import validate from '../utils/validate';

class FixtureController {
	constructor(userService, adminService, teamService, fixtureService) {
		this.adminService = adminService;
		this.userService = userService;
		this.teamService = teamService;
		this.fixtureService = fixtureService;
	}

	async createFixture(req, res) {
		// NOTE: The token is already been set in the middleware attached to this route
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		const errors = validate.fixtureValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		// In case of no errors
		const { home, away, matchday, matchtime } = req.body;

		try {
			const adminId = tokenMetadata._id;

			// Verify if the admin who sent the req exists
			const admin = await this.adminService.getAdmin(adminId);

			// Check if the home and away teams exists, if there is no errors, we catch them in the catch block
			await this.teamService.checkTeams(home, away);

			const fixture = new Fixture({
				home,
				away,
				admin: admin._id,
				matchday,
				matchtime
			});

			const createdFixture = await this.fixtureService.createdFixture(fixture);
			return res.status(201).json({
				status: 201,
				success: true,
				data: createdFixture
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			});
		}
	}

	async updateFixture(req, res) {
		// Check the token metadata of the one who sent the req is an admin or not
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		// check the request param
		const { id } = req.params;

		if (!ObjectID.isValid(id)) {
			return res.status(400).json({
				status: 400,
				success: false,
				error: 'Fixture ID is not valid'
			});
		}

		const errors = validate.fixtureValidate(req);

		if (errors.length > 0) {
			return res.status(400).json({
				status: 400,
				success: false,
				errors
			});
		}

		// In case of no errors !
		const { home, away } = req.body;

		try {
			const adminId = tokenMetadata._id;
			// Check if the team exists
			const fixture = await this.fixtureService.adminGetFixture(id);

			if (fixture.admin._id.toHexString() !== adminId) {
				return res.status(401).json({
					status: 401,
					success: true,
					error: 'Unothorized: You are not the owner'
				});
			}

			// Check if both home and away team exists
			await this.teamService.checkTeams(home, away);

			// Update the fixture
			fixture = Object.assign(fixture, req.body);

			const updatedFixture = await this.fixtureService.updatedFixture(fixture);
			return res.status(200).json({
				status: 200,
				success: true,
				data: updatedFixture
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			});
		}
	}

	async deleteFixture(req, res) {
		// Check the token metadata
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized'
			});
		}

		// Check the req params
		const { id } = req.params;

		if (!ObjectID.isValid(id)) {
			return res.status(400).json({
				status: 401,
				success: false,
				error: 'Fixture is not valid'
			});
		}

		try {
			const adminId = tokenMetadata._id;

			// Check if the fixture exists and if the owner is legit, before update
			const fixture = await this.fixtureService.adminGetFixture(id);

			if (fixture.admin._id.toHexString() !== adminId) {
				return res.status(401).json({
					status: 401,
					success: false,
					error: 'Unothorized, You are not the owner'
				});
			}

			// Delete the fixture
			await this.fixtureService.deleteFixture(fixture._id);

			return res.status(200).json({
				status: 200,
				success: true,
				data: 'Deleted successfuly'
			});
		} catch (e) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			});
		}
	}

	async getFixture(req, res) {

		//The tokenMetadata has already been set in the request when the middleware attached to this route got executed
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'unauthorized',
			});
		}

		//check the request param
		const { id } = req.params;

		if (!ObjectID.isValid(id)) {
			return res.status(400).json({
				status: 400,
				success: false,
				error: 'fixture id is not valid'
			});
		}

		try {
			const authId = tokenMetadata._id;

			//verify if the account that want to view this fixture exists(weather admin or normal user)
			await this.userService.getUser(authId);

			const fixture = await this.fixtureService.getFixture(id);

			return res.status(200).json({
				status: 200,
				success: true,
				data: fixture
			});
		} catch(error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: e.message
			});
		}
	}

	async getFixtures(req, res) {

		//The tokenMetadata has already been set in the request when the middleware attached to this route ran
		const { tokenMetadata } = req;

		if (!tokenMetadata) {
			return res.status(401).json({
				status: 401,
				success: false,
				error: 'unauthorized',
			});
		}

		try {
			const authId = tokenMetadata._id;

			//verify if the account that want to view this fixture exists(weather admin or normal user)
			await this.userService.getUser(authId);

			const fixtures = await this.fixtureService.getFixtures();

			return res.status(200).json({
				status: 200,
				success: true,
				data: fixtures
			});
		} catch(error) {
			return res.status(500).json({
				status: 500,
				success: false,
				error: error.message
			});
		}
	}
}

export default FixtureController;
