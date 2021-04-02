import Fixture from '../models/fixture';
import { ObjectID } from 'mongodb';

class FixtureService {
	constructor() {
		this.fixture = Fixture;
	}

	async createFixture(fixture) {
		try {
			const found = await this.fixture.findOne({
				$and: [
					{ home: fixture.home }, { away: fixture.away }
				]
			});

			if (found)
				throw new Error('This fixture already exists');

			const createdFixture = await this.fixture.create(fixture);
			return createdFixture;
		} catch (e) {
			throw e;
		}
	}

	async adminGetFixture(fixtureId) {
		try {
			const found = await this.fixture.findOne({ _id: fixtureId });

			if (!found) {
				throw new Error('No Fixture found');
			}

			return found;
		} catch (e) {
			throw e;
		}
	}

	async getFixture(fixtureId) {
		try {
			let fixtureIdObj = new ObjectID(fixtureId);
			const foundFixture = await this.fixture.findOne({ _id: fixtureIdObj }, { admin: 0 })
													.select('-__v')
													.populate('home', '_id: name')
													.populate('away', '_id name')
													.exec()

			if (!foundFixture) {
				throw new Error('No fixture found');
			}
			return foundFixture;
		} catch (e) {
			throw e;
		}
	}

	async updateFixture(fixture) {
		try {
			const gettedFixture = await this.fixture.findOne({
				$and: [
					{ home: fixture.home }, { away: fixture.away }
				]
			});

			if (gettedFixture && (gettedFixture._id.toHexString() !== fixture._id.toHexString())) {
				throw new Error('Fixture Already exists');
			}

			const updatedFixture = await this.fixture.findOneAndUpdate(
				{ _id: fixture._id },
				{ $set: fixture },
				{ 'new': true },
			);

			return updatedFixture;
		} catch (e) {
			throw e;
		}
	}

	async getFixtures() {
		try {
			const gottenFixtures = await this.fixture.find()
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.sort('matchday')
				.exec()

			return gottenFixtures;
		} catch (e) {
			throw e;
		}
	}

	async deleteFixture(fixtureId) {
		try {
			const deleted = await this.fixture.deleteOne({ _id: fixtureId });

			if (deleted.deletedCount === 0) {
				throw new Error('Something is not good !!');
			}

			return deleted;
		} catch (e) {
			throw e;
		}
	}
}

export default FixtureService;
