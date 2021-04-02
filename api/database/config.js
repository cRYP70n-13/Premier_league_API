import config from 'dotenv';

config.config()

// The default env is production, in heroku case
const env = process.env.NODE_ENV || 'development';

console.log('env *******', env);

export const dbconn = () => {
	let conn;

	if (env === 'development')
		conn = process.env.DEV_MONGO_URI // Local mongo
	if (env === 'test')
		conn = process.env.TEST_MONGO_URI // Using test

	return conn;
}
