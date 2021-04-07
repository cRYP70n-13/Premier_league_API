import faker from 'faker'
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb'
import User from '../models/user'
import  password from '../utils/password';
import LoginService from './login.service'
import { seedUser } from '../test-setup/seed'
import  { connect, clearDatabase, closeDatabase  }  from '../test-setup/db-config'

const seededUser;

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => {
	await connect();
});

beforeEach(async () => {
	seededUser = await seedUser()
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
	await clearDatabase();
});

/**
 * Remove and close the db and server.
 */
afterAll(async () => {
	await closeDatabase();
});

describe('LoginService', () => {
	describe('Login', () => {
		it('should not login a user if the user does not exists', async () => {
			const email = 'user@gmail.com';
			const pass = 'pass';
			const loginService = new LoginService();

			await expect(loginService.login(email, pass)).rejects.toThrow('record not found');
		});

		it('SHould not login a user if password does not match with the hash', async () => {
			const email = seededUser.email;
			const pass = 'Not-a-password'; // Does not match the hash

			// We should mock the external dependencies to achieve the unit test
			const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(false); // passwords does not matches

			await expect(loginService.login(email, pass)).rejects.toThrow('Invalid user credentiels');
			expect(passStub).toHaveBeenCalled();
		});

		it('Should login a user successfully', async () => {
			// This can either be an admin or a normal user
			const email = seededUser.email;
			const pass = 'password';

			const stubToken = 'jkndndfnskdjnfskjdnfjksdnf';
			const passStub = jest.spyOn(password, 'validPassword').mockReturnValue(true) //the passwords match
			const jwtStub = jest.spyOn(jwt, 'sign').mockReturnValue(stubToken); //our fake token

			const loginService = new LoginService();
			const token = await loginService.login(email, pass);

			expect(passStub).toHaveBeenCalled();
			expect(jwtStub).toHaveBeenCalled();
			expect(token).not.toBeNull();
			expect(token.length).toBeGreaterThan(0)
			expect(token).toBe(stubToken);
		});
	});
});
