import jwt from 'jsonwebtoken';
import config from 'dotenv';

config.config();

export const auth = (req, res, next) => {
	try {
		const bearToken = req.headers['authorization'];

		if (!bearToken) {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized, you need to be authenticated'
			});
		}

		// Split the bearToken to get the token
		const token = bearToken.split(' ', 2)[1];

		if (!token) {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized, you need to be authenticated'
			});
		}

		const tokenMetadata = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenMetadata && (tokenMetadata.role === 'user' || 'admin')) {
			req.tokenMetadata = tokenMetadata;
			next();
		} else {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized, you need to be authenticated'
			});
		}
	} catch (error) {
		res.status(401).json({
			status: 401,
			success: false,
			error: `Unothorized ${error.message}`
		});
	}
}

export const adminAuth = (req, res, next) => {
	try {
		const bearToken = req.headers['authorization'];

		if (!bearToken) {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized, you are not an admin'
			});
		}

		// Split the beartoken to get the token
		const token = bearToken.split(' ', 2)[1];

		if (!token) {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized, you are not an admin'
			});
		}

		const tokenMetadata = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenMetadata && (tokenMetadata.role === 'admin')) {
			req.tokenMetadata = tokenMetadata;
			next();
		} else {
			res.status(401).json({
				status: 401,
				success: false,
				error: 'Unothorized,  you are not an admin'
			});
		}
	} catch (error) {
		res.status(401).json({
			status: 401,
			success: false,
			error: `Unothorized, ${error.message}`
		});
	}
}
