import supertest from 'supertest';
import app from '../app/app';
import http from 'http';
import { seedAdmin } from '../test-setup/seed';
import { clearDatabase, closeDatabase } from '../test-setup/db-config';

let server, request, seededAdmin;

beforeAll(async () => {
    server = http.createServer(app);
    await server.listen();
    request = supertest(server);
});

beforeEach(async () => {
    seededAdmin = await seedAdmin();
});

/**
 * @desc {*} Clear all the data after every test
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

describe('Authenticate E2E', () => {
	decribe('POST /login', () => {
		it('should login an admin', async () => {
			const details = {
				email: 'otmane.kimdil@gmail.com',
				password: 'password'
			};
			const res = await request
				.post('/api/v1/login')
				.send(details);

			expect(res.status).toEqual(200);
			expect(res.body.token.length).toBeGreaterThan(0);
		});

		it('Should not create a user if the record doesn\'t exists', async () => {
			const details = {
				email: 'Scar@example.com',
				password: 'pass'
			};
			const res = await request
				.post('/api/v1/login')
				.send(details);

			expect(res.status).toEqual(200);
			expect(res.body.error).toBe('User not found !!');
		});

		it('should not create a user if validations fails', async () => {
			const details = {
				email: 'example.com', // Not a valid one
				password: '' // Empty !!
			};
			const res = await request
				.post('/api/v1/login')
				.send(details);
			const errors = [
				{ email: 'a valid email is required' },
				{ password: 'A valid password with at leat 4 chars' }
			]

			expect(res.status).toEqual(400);
			expect(res.body.errors).toEqual(errors);
		});
	});
});
