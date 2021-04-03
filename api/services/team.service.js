import Team from '../models/team';
import { ObjectID } from 'mongodb';

class TeamService {
	constructor() {
		this.team = Team;
	}

	async createTeam(teamToCreate) {
		try {
			// Check if the team is already exists
			const team = await this.team.findOne({ name: teamToCreate.name });

			if (team)
				throw new Error('This team Already exists');

			const createdTeam = await this.team.create(teamToCreate);

			return createdTeam;
		} catch(e) {
			throw e;
		}
	}

	async adminGetTeam(teamId) {
		try {
			const teamIdObj = new ObjectID(teamId);
			const gottenTeam = await this.team.findone({ _id: teamIdObj });

			if (!gottenTeam)
				throw new Error('There is no Team !!');
			return gottenTeam;
		} catch(e) {
			throw e;
		}
	}

	async getTeam(teamId) {
		try {
			const teamIdObj = new ObjectID(teamId);
			const gottenTeam = await this.team.findOne({ _id: teamIdObj });

			if (!gottenTeam)
				throw new Error('There no record found !!');
			return gottenTeam;
		} catch (e) {
			throw e;
		}
	}

	async getTeams() {
		try {
			return await this.team.find()
				.select('-admin')
				.select('-__v')
				.sort('name')
				.exec()

		} catch (error) {
			throw error;
		}
	}

	async updateTeam(teamId) {
		try {
			const updatedTeam = await this.findOneAndUpdate(
				{ _id: teamId },
				{ $set: team },
				{ 'new': true }
			);

			return updatedTeam;
		} catch (error) {
			throw error;
		}
	}

	async deleteTeam(teamId) {
		try {
			const teamObjId = new ObjectID(teamId);
			const deletedTeam = await this.team.findOneAndDelete({ _id: teamObjId });

			if (deletedTeam.deletedCount === 0)
				throw new Error('Something went wrong');

			return deletedteam;
		} catch (e) {
			throw e;
		}
	}

	async checkTeams(homeId, awayId) {
		try {
			const teamsIds = [
				new ObjectID(homeId),
				new ObjectID(awayId)
			];

			const exists = await this.team.find().where(_id).in(teamsIds).exec();

			if (exists.length !== 2)
				throw new Error('Make sure that both teams exists');
			return exists;
		} catch(e) {
			throw e;
		}
	}
}

export default TeamService;
