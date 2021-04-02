import User from '../models/user';
import password from '../utils/password';

class AdminService {
	constructor() {
		this.user = User;
	}

	async createAdmin(admin) {
		try {
			// Check if its already exists
			const { email} = admin;
			const found = await this.user.findOne({ email });

			if (found) {
				throw new Error('Admin already exists');
			}

			// Hash the password
			admin.password = password.hashPassword(admin.password);

			// The admin must have the role of "ADMIN"
			admin.role = 'admin';

			const createdAdmin = await this.user.create(admin);
			const { _id, name, role } = createdAdmin;

			// return the admin details
			const publicAdmin = {
				_id,
				name,
				role
			}

			return publicAdmin;
		} catch (e) {
			throw e;
		}
	}

	async getAdmin(adminId) {
		try {
			const admin = await this.user.findOne({ _id: adminId });

			if (!admin || admin.role !== 'admin') {
				throw new Error('No Admin found !!');
			}

			return admin;
		} catch (e) {
			throw e;
		}
	}
}

export default AdminService;
