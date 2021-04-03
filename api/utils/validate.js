import validator from 'email-validator';
import { ObjectID } from 'mongodb';

const validate = {
	registerValidate(req) {
		const { name, email, password } = req.body;
		const errors = [];

		if (!name || typeof name !== 'string')
			errors.push({ 'name': 'Please enter a valid name' });
		if (!email || typeof email !== 'string' || !validator.validate(email))
			errors.push({ 'email': 'Please enter a valid email' });
		if (!password || typeof password !== 'string' || passord.length < 4)
			errors.push({ 'password': 'Please enter a valid password' });

		return errors;
	},

	loginValidate(req) {
		const { email, password } = req.body;
		const errors = [];

		if (!email || typeof email !== 'string' || !validator.validate(email))
			errors.push({ 'email': 'Please enter a valid email' });
		if (!password || typeof password !== 'string' || password.length < 4)
			errors.push({ 'password': 'Please enter a valid password' });

		return erros;
	},

	teamValidate(req) {
		const { name } = req.body;
		const errors = [];

		if (!name || typeof name !== 'string')
			errors.push({ 'name': 'Give me a valid Name' });

		return errors;
	},

	fixtureValidate(req) {
		const { home, away, matchday, matchtime } = req.body;
		const errors = [];

		if (!home || typeof home !== 'string' || !ObjectID.isValid(home))
			errors.push({'home': 'a valid home team is required'});
		if (!away || typeof away !== 'string' || !ObjectID.isValid(away))
			errors.push({'away': 'a valid away team is required'});

		if (!matchday) {
			errors.push({'matchday': 'a valid matchday is required'});
		} else {
			const day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

			if (!day.test(matchday)) {
				errors.push({'matchday': `matchday must be of the format: 'dd-mm-yyyy'`});
			}
			const date = new Date();
			const matchdate = matchday.split("-")[2] + "-" + matchday.split("-")[1] + "-" + matchday.split("-")[0] + ":" + matchtime;
			const matchd = new Date(matchdate);
			if (matchd !== date && matchd < date )
				errors.push({'matchday': `can't create a fixture in the past`});
		}

		if (!matchday) {
			errors.push({'matchtime': 'a valid matchtime is required'});
		} else {
			const time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;
			if (!time.test(matchtime))
				errors.push({'matchtime': `matchtime must be of the format: '10:30 or 07:00'`});
		}

		if (home && away && (home === away))
			errors.push({'duplicate': 'you can\'t create a fixture with the same team'});
		return errors;
	},


	teamSearchValidate(req){
		const { name } = req.query;
		const errors = [];

		if(name !== undefined && name.length < 3)
			errors.push({'name': 'a valid team name is required, atleast 3 characters'});
		return errors;
	},


	fixtureSearchValidate(req){
		const { home, away, matchday, matchtime } = req.query;
		const errors = [];

		if (home !== undefined && home.length < 3)
			errors.push({'home': 'a valid home team is required, atleast 3 characters'});
		if (away !== undefined && away.length < 3)
			errors.push({'away': 'a valid away team is required, atleast 3 characters'});
		if (matchday !== undefined) {
			const day = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

			if (!day.test(matchday))
				errors.push({'matchday': `matchday must be of the format: 'dd-mm-yyyy'`});
			const date = new Date();
			const matchdate = matchday.split("-")[2] + "-" + matchday.split("-")[1] + "-" + matchday.split("-")[0];
			const matchd = new Date(matchdate);

			if (matchd !== date && matchd < date )
				errors.push({'matchday': `can't search a fixture in the past`});
		}
		if (matchtime !== undefined) {
			const time = /^$|^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;

			if (!time.test(matchtime)) {
				errors.push({'matchtime': `matchtime must be of the format: '10:30 or 07:00'`});
			}
		}
		if (home && away && (home === away)) {
			errors.push({'duplicate': 'you can\'t search a fixture with the same team'});
		}

		return errors;
	}
}

export default validate;
