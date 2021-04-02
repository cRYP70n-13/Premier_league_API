import jwt from 'jsonwebtoken';
import config from 'dotenv';
import password from '../utils/password';
import User from '../models/user';

config.config()

class LoginService {
	constructor() {
		this.user = User;
	}

	async login(email, pass) {
		try {
			const user = await this.user.findOne({ email: email });

			if (!user) {
				throw new Error('User not found !!');
			}

			const correctPassword = password.validPassword(pass, user.password);

			if (correctPassword) {
				let userCred = {
					_id: user._id.toHexString(),
					role: user.role
				}

				const token = jwt.sign(userCred, process.env.JWT_SECRET).toString();
				return token;
			} else {
				throw new Error('Invalid User Credentials');
			}
		} catch (e) {
			throw e;
		}
	}
}

export default LoginService;
