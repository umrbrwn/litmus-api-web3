import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import pino from 'pino';
global.log = pino();

import { errorHandler } from './modules/middlewares.js';
import { setup as apiSetup } from './api/index.js';

const app = express();
app.use(express.json());
app.use(helmet());

apiSetup(app, express.Router());

app.use(errorHandler);

const port = process.env.LITMUS_API_PORT || 3000;
app.listen(port, () => {
  console.log(`Litentry API listening on port ${port}`)
});

// exit safely to clean up any aquired resources i.e. db connection
const shutdown = () => process.exit();

// register cleanup events
process.on('SIGTERM', shutdown); // ctrl c
process.on('SIGINT', shutdown); // ctrl z
process.on('uncaughtException', (err) => {
  global.log.fatal(err.stack);
});
