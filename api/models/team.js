import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
	name: {
		type: String,
		required: true,
		max: 255,
		unique: true
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
});

export default mongoose.model('Team', TeamSchema);
