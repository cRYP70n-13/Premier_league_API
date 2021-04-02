import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FixtureSchema = new Schema({
	home: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Team'
	},
	away: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Team'
	},
	matchday: {
		type: String,
		required: true
	},
	matchtime: {
		type: String,
		required: true,
	},
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
});

export default mongoose.model('Fixture', FixtureSchema);
