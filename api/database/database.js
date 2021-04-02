import mongoose from 'mongoose';
import { dbconn } from './config'

// mongoose uses callback by default.
mongoose.Promise = global.Promise;

const conn = dbconn();

const mongoDB = process.env.MONGODB_URI || conn;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true}, );

export default mongoose
