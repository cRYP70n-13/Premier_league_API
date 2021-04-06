import supertest from 'supertest';
import app from '../app/app';
import http from 'http';
import { seedTeams, seedTeamsAndFixtures } from '../test-setup/seed';
import { clearDatabase, closeDatabase } from '../test-setup/db-config';

const server, request;

beforeAll(async () => {
	server = http.createServer(app);
	await server.listen();
	request = supertest(server);
});

beforeEach(async () => {
	await seedTeams();
	await seedTeamsAndFixtures();
});

/**
 * @desc {*} Clear all the test db and server
 * @returns {*} NONE
 **/
afterEach(async () => {
	await clearDatabase();
});

/**
 * @desc {*} Remove and close the test db and server
 * @returns {*} NONE
 **/
afterAll(async () => {
	await server.close();
	await closeDatabase();
});

describe('Search E2E', () => {
	describe('SearchTeam /search/team', async () => {
		it('Should search a team and get result', async () => {
			const team = 'Watford';
			const res = await request
				.get(`/api/v1/search/team?name=${team}`);

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toBeGreaterThan(0);
		});

		it('Should search a team using wildcard and get result', async () => {
			const team = 'Ars'; // Search for any time that might be like Arsenal
			const res = request
				.get(`/api/v1/search/team?name=${team}`);

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toBeGreaterThan(0);
		});

		it('Should not search for a team if the query name is less than 3', async () => {
			const team = 'Wa'; // length < 4
			const res = await request
				.get(`/api/v1/search/team?name=${team}`);
			const errors = [
				{ name: 'A valid team name is required' }
			];

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toEqual(errors);
		});

		it('Should search a team and not get it if its not found', async () => {
			const team = 'Otmane';
			const res = request
				.get(`/api/v1/search/team?name=${team}`);

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toEqual(0);
		});

		// Test the fixture if it works
		it('should search a fixture and get result when all query params are provided', async () => {
			// We already have the matches below
			const home = 'Lierpool';
			const away = 'Arsenal';
			const matchday = '20-10-2050';
			const matchtime = '10:30';

			const res = request
				.get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`);

			expect(res.satutus).toEqual(200);
			expect(res.body.data.length).toBeGreaterThan(0);
		});

		it('should search a fixture and get result when two query params are provided', async () => {
			//we have a seed that matches the below
			const away = 'Arsenal'
			const matchtime = '10:30'

			const res = await request
				.get(`/api/v1/search/fixture?away=${away}&matchtime=${matchtime}`)

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toBeGreaterThan(0);
		});


		it('should not search a fixture when invalid data is provided', async () => {

			//if any of the query is typed in the url, it needs to have a value
			const home = '';
			const away = 'Ar'; //atlest 3 characters are required
			const matchday = '0-1-2050'; //invalid date
			const matchtime = '0:3'; //invalid time

			const res = await request
				.get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`);

			const errors =  [
				{ "home": "a valid home team is required, atleast 3 characters" },
				{ "away": "a valid away team is required, atleast 3 characters" },
				{ "matchday": "matchday must be of the format: 'dd-mm-yyyy'" },
				{ "matchtime": "matchtime must be of the format: '10:30 or 07:00'" },
			];

			expect(res.status).toEqual(400);
			expect(res.body.errors).toEqual(errors);
		});


		it('should search and not get a fixture if not found', async () => {

			//we have a seed that matches the below
			const home = 'Barcelona';
			const away = 'Juventus';
			const matchday = '20-10-2050';
			const matchtime = '10:30';

			const res = await request
				.get(`/api/v1/search/fixture?home=${home}&away=${away}&matchday=${matchday}&matchtime=${matchtime}`);

			expect(res.status).toEqual(200);
			expect(res.body.data.length).toEqual(0);
		});
	});
});
