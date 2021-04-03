import User from '../models/user';
import password from '../utils/password';
import { ObjectID } from 'mongodb';


class UserService {
	constructor() {
		this.user = User;
	}

	async createUser(user) {
		try {
			//check if the user already exists
			const record = await this.user.findOne({ email: user.email });

			if (record) {
				throw new Error('record already exists');
			}

			user.password = password.hashPassword(user.password);

			//assign role:
			user.role = "user";

			//create the user
			const createdUser = await this.user.create(user);
			const { _id, name, role } = createdUser;

			//return user details except email and password:
			const publicUser = {
				_id,
				name,
				role
			};

			return publicUser;

		} catch(error) {
			throw error;
		}
	}

	//This user can either be an "admin" or a "normal user"
	//This function is used to check if a user is authenticated
	async getUser(userId) {
		try {
			const userObjID = new ObjectID(userId);
			const gottenUser = await this.user.findOne({ _id: userObjID });

			if (!gottenUser) {
				throw new Error('no record found');
			}

			const { name, role } = gottenUser;

			//return user details except email and password:
			const publicUser = {
				_id: gottenUser._id,
				name,
				role
			};

			return publicUser;

		} catch(error) {
			throw error;
		}
	}
}

export default UserService;
