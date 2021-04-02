import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
		max: 100
	},
	email: {
		type: String,
		required: true,
		max: 255
	},
	password: {
		type: String,
		required: true,
		max: 255
	},
	role: {
		type: String,
		required: true,
		max: 100
	}
}, { collection: 'User' });

export default mongoose.model('User', UserSchema, 'User');
