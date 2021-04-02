import config from 'dotenv';
import express from 'express';

import routes from '../routes/routes';
import mongoose from '../database/database';

config.config()
const app = express();

// Instead of body parser
app.use(express.json())

// API routes
app.use('/api/v1', routes);

// The HOME route
app.get('/', (req, res) => res.status(200).send({
	success: 'Hello !! Welcome to premier league API'
}));

export default app;
