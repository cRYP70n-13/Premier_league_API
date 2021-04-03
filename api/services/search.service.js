import Team from '../models/team';
import Fixture from '../models/fixture';

class SearchService {
	constructor() {
		this.team = Team;
		this.fixture = Fixture;
	}

	async searchTeam(name) {
		try {
			const teams = this.team.find({ 'name': { $regex: '.*'+ name, $options: 'i' + '.*' }})
				.select('-admin')
				.select('-__v')
				.exec()
			return teams
		} catch (err) {
			throw err;
		}
	}

	async searchFixture({ home, away, matchday, matchtime }) {
		if (home && !away && !matchday && !matchtime)
			return await this.searchHomeFixture(home);
		else if (!home && away && !matchday && !matchtime)
			return await this.searchAwayFixture(away);
		else if (!home && !away && matchday && !matchtime)
			return await this.searchMatchDayfixture(matchday);
		else if (!home && !away && !matchday && matchtime)
			return await this.searchMatchTimeFixture(matchtime);
		else if (home && away && !matchday && !matchtime)
			return await this.searchHomeAndAwayFixture(home, away);
		else if (home && !away && matchday && !matchtime)
			return await this.searchHomeAndMatchDayFixture(home, matchday);
		else if (home && !away && !matchday && matchtime)
			return await this.searchHomeAndMatchTimeFixture(home, matchtime);
		else if (home && away && matchday && !matchtime)
			return await this.searchHomeAwayAndMatchDayFixture(home, away, matchday);
		else if (home && away && !matchday && matchtime)
			return await this.searchHomeAwayAndMatchTimeFixture(home, away, matchtime);
		else if (home && !away && matchday && matchtime)
			return await this.searchHomeMatchDayAndMatchTimeFixture(home, matchday, matchtime);
		else if (!home && away && matchday && !matchtime)
			return await this.searchAwayAndMatchDayFixture(away, matchday);
		else if (!home && away && !matchday && matchtime)
			return await this.searchAwayAndMatchTimeFixture(away, matchtime);
		else if (!home && away && matchday && matchtime)
			return await this.searchAwayMatchDayAndMatchTimeFixture(away, matchday, matchtime);
		else if (!home && !away && matchday && matchtime)
			return await this.searchMatchDayAndMatchTimeFixture(matchday, matchtime);
		else if (home && away && matchday && matchtime)
			return await this.searchHomeAwayMatchDayAndMatchTimeFixture(home, away, matchday, matchtime);
		else
			return [];
	}

	async searchMatchDayAndMatchTimeFixture(matchDay, matchTime) {
		const awayMatchTimeFixtures = await this.fixture.find({ matchday: matchDay, matchtime: matchTime })
			.select('-admin')
			.select('-__v')
			.populate('home', '_id name')
			.populate('away', '_id name')
			.exec()

		return awayMatchTimeFixtures;
	}

	async searchAwayMatchDayAndMatchTimeFixture(awayTeam, matchDay, matchTime) {
		const aways = await this.team.find({ 'name': { $regex: '.*' + awayTeam, $options: 'i' + '.*' }})

		if (aways.length > 0) {
			const awaysId = [];

			aways.map(team => awaysId.push(team._id));

			const awaytMatchDayMatchTimeFixtures = await this.fixture.find({ away: { $in: awaysId }, matchday: matchDay, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec()

			return awaytMatchDayMatchTimeFixtures;
		}
	}

	async searchAwayAndMatchTimeFixture(awayTeam, matchTime) {
		const aways = await this.team.find({ 'name': { $regex: '.*' + awayTeam, $options: 'i' + '.*' }});

		if (aways.length > 0) {
			const awaysId = [];

			awaysId.map(team => awaysId.push(team._id));

			const awayMatchTimeFixtures = await this.fixture.find({ away: { $in: awaysId }, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return awayMatchTimeFixtures;
		}
	}

	async searchAwayAndMatchDayFixture(awayTeam, matchDay) {
		const aways = await this.team.find({ 'name': { $regex: '.*' + awayTeam, $options: 'i' + '.*' }})
			.select('-admin')
			.select('-__v')
			.populate('home', '_id name')
			.populate('away', '_id name')
			.exec();

		if (aways.length > 0) {
			const awaysId = [];

			aways.map(team => awaysId.push(team._id));

			const awayMatchDayFixtures = await this.fixture.find({ away: { $in: awaysId }, matchday: matchDay})
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return awayMatchDayFixtures;
		}
	}

	async searchHomeMatchDayAndMatchTimeFixture(homeTeam, matchDay, matchTime) {
		const homes = await this.team.find({ 'name': { $regex: '.*' + homeTeam, $options: 'i' + '.*' }})
			.select('-admin')
			.select('-__v')
			.populate('home', '_id name')
			.populate('away', '_id name')
			.exec();

		if (homes.length > 0) {
			const homesId = [];

			homes.map(team => homesId.push(team._id));

			const homeMatchDayMatcheTimeFixture = await this.find({ home: { $in: homesId }, matchday: matchDay, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeMatchDayMatcheTimeFixture;
		}
	}

	async searchHomeAwayAndMatchTimeFixture(homeTeam, awayTeam, matchTime) {
		const homesId = await this._getHomesId(homeTeam);
		const awaysId = await this._getAwaysId(awayTeam);

		if (homesId && awaysId) {
			const homeAwayMatchTimeFixture = await this.fixture.find({ home: { $in: homesId }, away: { $in: awaysId }, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeAwayMatchTimeFixture;
		}
	}

	async searchHomeAwayAndMatchDayFixture(homeTeam, awayTeam, matchDay) {
		const homesId = await this._getHomesId(homeTeam);
		const awaysId = await this._getAwaysId(awayTeam);

		if (homesId && awaysId) {
			const homeAwayMatchDayFixture = await this.fixture.find({ home: { $in: homesId }, away: { $in: awysId }, matchday: matchDay })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeAwayMatchDayFixture;
		}
	}

	async searchHomeAndMatchTimeFixture(homeTeam, matchTime) {
		const homes = await this.team.find({ 'name': { $regex: '.*' + homeTeam, $options: 'i' + '.*' }});

		if (homes.length > 0) {
			const homesId = [];

			homes.map(team => homesId.push(team._id));

			const homeMatchDayFixtures = await this.fixture.find({ home: { $in: homesId }, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeMatchDayFixtures;
		}
	}

	async searchHomeAndMatchDayFixture(homeTeam, matchDay) {
		const homes = await this.team.find({ 'name': { $regex: '.*' + homeTeam, $options: 'i' + '.*' }});

		if (homes.length > 0) {
			const homesId = [];

			homes.map(team => homesId.push(team._id));

			const homeMatchDayFixtures = await this.fixture.find({ home: { $in: homesId }, matchday: matchDay })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeMatchDayFixtures;
		}
	}

	async searchHomeAndMatchDayFixture(matchday) {
		const matchDays = await this.fixture.find({ matchday })
			.select('-admin')
			.select('-__v')
			.populate('home', '_id name')
			.populate('away', '_id name')
			.exec();

		return matchDays;
	}

	async searchMatchTimeFixture(matchtime) {
		const matchTimes = await this.fixture.find({ matchtime })
			.select('-admin')
			.select('-__v')
			.populate('home', '_id name')
			.populate('away', '_id name')
			.exec();

		return matchTimes;
	}

	async searchHomeFixture(homeTeam) {
		const homes = await this.team.find({ 'name': { $regex: '.*' + homeTeam, $options: 'i' + '.*' }});

		if (homes.length > 0) {
			const homeIds = [];

			homes.map(team => homeIds.push(team._id));

			const homeFixtures = await this.fixture.find({ home: { $in: homeIds } })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return homeFixtures;
		}
	}

	async searchAwayFixture(awayTeam) {
		const aways = await this.team.find({ 'name': { $regex: '.*' + awayTeam, $options: 'i' + '.*' }})

		if (aways.length > 0) {
			const awayIds = [];

			aways.map(team => awayIds.push(team._id));

			const awaysFixtures = this.fixture.find({ away: { $in: awayIds } })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return awaysFixtures;
		}
	}

	async searchHomeAndAwayFixture(homeTeam, awayTeam) {
		const homeIds = await this._getHomesId(homeTeam);
		const awayIds = await this._getAwaysId(awayTeam);

		if (homeIds && awayIds) {
			const fixtures = await this.fixture.find({ home: { $in: homeIds }, away: { $in: awayIds }})
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return fixtures;
		}
	}

	async searchHomeAwayMatchDayAndMatchTimeFixture(homeTeam, awayTeam, matchDay, matchTime) {
		const homeIds = await this._getHomesId(homeTeam);
		const awayIds = await this._getAwaysId(awayTeam);

		if (homeIds && awayIds) {
			const fixtures = await this.fixture.find({ home: { $in: homeIds }, aways: { $in: awayIds }, matchday: matchDay, matchtime: matchTime })
				.select('-admin')
				.select('-__v')
				.populate('home', '_id name')
				.populate('away', '_id name')
				.exec();

			return fixtures;
		}
	}

	async _getHomesId(homeTeam) {
		const homes = await this.team.find({ 'name': { $regex: '.*' + homeTeam, $options: 'i' + '.*' }});

		if (homes.length > 0) {
			const homeIds = [];

			homeIds.map(team => homeIds.push(team._id));

			return homeIds;
		}
	}

	async _getAwaysId(awayTeam) {
		const aways = await this.team.find({ 'name': { $regex: '.*' + awayTeam, $options: 'i' + '.*' }});

		if (aways.length > 0) {
			const awayIds = [];

			aways.map(team => awayIds.push(team._id));

			return awayIds;
		}
	}
}

export default SearchService;
