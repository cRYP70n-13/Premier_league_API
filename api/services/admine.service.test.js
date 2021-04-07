import { ObjectID } from 'mongodb';
import AdminService from './admin.service';
import password from '../utils/validate';
import { seedAdmin } from '../test-setup/seed';
import { connect, clearDatabase, closeDatabase } from '../test-setup/db-config';

const seededAdmin;

/**
 * @desc {*} Connect to a new in-memory database before running tests
 * @returns {*} NONE
 **/
beforeAll(async () => {
	await connect();
});

/**
 * @desc {*} Seed the admin to the db
 * @returns {*} NONE
 **/
beforeEach(async () => {
	seededAdmin = await seedAdmin();
});

/**
 * @desc {*} Clear all the test data
 * @returns {*} NONE
 **/
afterEach(async () => {
	await clearDatabase();
});

/**
 * @desc {*} Remove and close db and the server
 * @returns {*} NONE
 **/
afterAll(async () => {
	await closeDatabase();
});

describe('AdminService', () => {
	describe('CreateAdmin', () => {
		it('Should not create a new admin if record already there', async () => {
			try {
				const admin = {
					name: 'frank',
					email: seededAdmin.email,
					password: 'Password'
				};
				const adminService = new AdminService();

				await adminService.createAdmin(admin);
			} catch (e) {
				expect(e.message).toMatch('record already there');
			}
		});

		it('Should create a new Admin', async () => {
			const adminNew = {
				name: 'Otmane',
				email: 'Otmane.kimdil@gmail.com',
				password: '07m4n3KIMDIL'
			};
			// Hash the password
			const hashPass = jest.spyOn(password, 'hashPassword').mockReturnValue('alsdkjflkasjdlfksjl');
			const adminService = new AdminService();
			const admin = await adminService.createAdmin(adminNew);

			expect(hashPass).toHaveBeenCalled();
			expect(admin._id).toBeDefined();
			expect(admin.name).toBe(adminNew.name);
			expect(admin.role).toBe(adminNew.role);
		});
	});

	describe('get admin', () => {
		it('should not get an admin if record does not exists', async () => {
			try {
				// The following admin is not there
				const adminObjID = new ObjectID('5e682d0d580b5a6fb795b842');
				const adminService = new AdminService();

				await adminService.getAdmin(adminObjID);
			} catch (e) {
				expect(e.message).toMatch('no record found');
			}
		});

		it('should get an admin', async () => {
			const adminService = new AdminService();
			const admin = await adminService.getAdmin(seededAdmin._id);

			expect(admin._id).toEqual(seededAdmin._id);
			expect(admin.name).toBe(seedeAdmin.name);
			expect(admin.role).toBe(seedeAdmin.role);
		});
	});
});
